import { useEffect, useRef, useState, type RefObject } from 'react';
import type { HeartbeatInput } from './useTrailFlow';

/** Interval between heartbeats; the server credits at most 15 s per heartbeat. */
export const HEARTBEAT_INTERVAL_MS = 10_000;

/** A student idle for longer than this stops earning engagement time. */
const IDLE_AFTER_MS = 60_000;

type SendHeartbeat = (input: HeartbeatInput) => void;

function useIsDocumentVisible() {
  const [visible, setVisible] = useState(() => document.visibilityState === 'visible');
  useEffect(() => {
    const update = () => setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  return visible;
}

function useIsOnScreen(ref: RefObject<Element | null>, threshold = 0.2) {
  const [onScreen, setOnScreen] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry?.isIntersecting ?? false),
      { threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return onScreen;
}

function useLastInteraction() {
  const lastInteraction = useRef(0);
  useEffect(() => {
    lastInteraction.current = Date.now();
    const mark = () => {
      lastInteraction.current = Date.now();
    };
    const events = ['pointermove', 'pointerdown', 'keydown', 'scroll', 'touchstart', 'wheel'];
    events.forEach((name) => window.addEventListener(name, mark, { passive: true }));
    return () => events.forEach((name) => window.removeEventListener(name, mark));
  }, []);
  return lastInteraction;
}

/**
 * Tracks a text or image lesson. Heartbeats are only sent while the tab is visible,
 * the lesson is on screen and the student interacted recently, so leaving the page
 * open does not count as studying. The end marker reports when the student
 * scrolled to the end of the lesson.
 */
export function useReadingTracker({
  lessonId,
  completed,
  send,
  containerRef,
  endRef,
}: {
  lessonId: string;
  completed: boolean;
  send: SendHeartbeat;
  containerRef: RefObject<Element | null>;
  endRef: RefObject<Element | null>;
}) {
  const documentVisible = useIsDocumentVisible();
  const onScreen = useIsOnScreen(containerRef);
  const reachedEnd = useIsOnScreen(endRef, 1);
  const lastInteraction = useLastInteraction();
  const reachedEndRef = useRef(false);
  const sendRef = useRef(send);

  useEffect(() => {
    sendRef.current = send;
  }, [send]);

  useEffect(() => {
    if (reachedEnd) reachedEndRef.current = true;
  }, [reachedEnd]);

  const active = documentVisible && onScreen && !completed;

  useEffect(() => {
    if (!active) return;
    const beat = () => {
      if (Date.now() - lastInteraction.current > IDLE_AFTER_MS) return;
      sendRef.current({ lessonId, event: 'progress', reachedEnd: reachedEndRef.current });
    };
    beat();
    const timer = window.setInterval(beat, HEARTBEAT_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [active, lastInteraction, lessonId]);
}

/**
 * Tracks an HTML5 video: reports the playback position every ten seconds while
 * playing, on pause and at the end. The server only credits segments that were
 * actually played, so seeking ahead does not count.
 */
export function useVideoTracker({
  lessonId,
  send,
  videoRef,
  resumeAt,
}: {
  lessonId: string;
  send: SendHeartbeat;
  videoRef: RefObject<HTMLVideoElement | null>;
  resumeAt: number | null;
}) {
  const sendRef = useRef(send);
  useEffect(() => {
    sendRef.current = send;
  }, [send]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let lastSent = 0;
    const report = (event: HeartbeatInput['event']) =>
      sendRef.current({ lessonId, event, position: Math.floor(video.currentTime) });

    const onLoaded = () => {
      if (resumeAt && resumeAt < video.duration - 5) video.currentTime = resumeAt;
    };
    const onPlay = () => {
      lastSent = Date.now();
      report('progress');
    };
    const onTime = () => {
      if (Date.now() - lastSent < HEARTBEAT_INTERVAL_MS) return;
      lastSent = Date.now();
      report('progress');
    };
    const onPause = () => report('progress');
    const onEnded = () => report('ended');
    const onRate = () => {
      if (video.playbackRate > 2) video.playbackRate = 2;
    };

    video.addEventListener('loadedmetadata', onLoaded);
    video.addEventListener('play', onPlay);
    video.addEventListener('timeupdate', onTime);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnded);
    video.addEventListener('ratechange', onRate);
    return () => {
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('timeupdate', onTime);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('ratechange', onRate);
    };
  }, [lessonId, resumeAt, videoRef]);
}
