import { useEffect, useRef, type RefObject } from 'react';

/** Interval between video heartbeats while playing. */
export const HEARTBEAT_INTERVAL_MS = 10_000;

type ReportPosition = (position: number) => void;

function useLatest<T>(value: T) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}

/**
 * Tracks an HTML5 video: reports the position every ten seconds while playing, on pause and at
 * the end. The server only credits segments that were actually played, so seeking ahead does not
 * count.
 */
export function useHtmlVideoTracker({
  videoRef,
  report,
  resumeAt,
}: {
  videoRef: RefObject<HTMLVideoElement | null>;
  report: ReportPosition;
  resumeAt: number | null;
}) {
  const reportRef = useLatest(report);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let lastSent = 0;
    const send = () => reportRef.current(Math.floor(video.currentTime));

    const onLoaded = () => {
      if (resumeAt && resumeAt < video.duration - 5) video.currentTime = resumeAt;
    };
    const onPlay = () => {
      lastSent = Date.now();
      send();
    };
    const onTime = () => {
      if (Date.now() - lastSent < HEARTBEAT_INTERVAL_MS) return;
      lastSent = Date.now();
      send();
    };
    const onRate = () => {
      if (video.playbackRate > 2) video.playbackRate = 2;
    };

    video.addEventListener('loadedmetadata', onLoaded);
    video.addEventListener('play', onPlay);
    video.addEventListener('timeupdate', onTime);
    video.addEventListener('pause', send);
    video.addEventListener('ended', send);
    video.addEventListener('ratechange', onRate);
    return () => {
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('timeupdate', onTime);
      video.removeEventListener('pause', send);
      video.removeEventListener('ended', send);
      video.removeEventListener('ratechange', onRate);
    };
  }, [reportRef, resumeAt, videoRef]);
}

interface YouTubePlayer {
  getCurrentTime(): number;
  getPlayerState(): number;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  destroy(): void;
}

interface YouTubeNamespace {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      playerVars?: Record<string, number | string>;
      events?: {
        onReady?: (event: { target: YouTubePlayer }) => void;
        onStateChange?: (event: { data: number; target: YouTubePlayer }) => void;
      };
    },
  ) => YouTubePlayer;
}

declare global {
  interface Window {
    YT?: YouTubeNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youTubeApi: Promise<YouTubeNamespace> | null = null;

function loadYouTubeApi(): Promise<YouTubeNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  youTubeApi ??= new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT) resolve(window.YT);
    };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.onerror = () => {
      youTubeApi = null;
      reject(new Error('YouTube player could not be loaded.'));
    };
    document.head.appendChild(script);
  });
  return youTubeApi;
}

/** Extracts the video id from common YouTube URL formats. */
export function youTubeId(url: string | null): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  return match?.[1] ?? null;
}

const YT_PLAYING = 1;

/**
 * Mounts a YouTube player in the container and reports the position every ten seconds while
 * playing, and whenever playback pauses or ends.
 */
export function useYouTubeTracker({
  containerRef,
  videoId,
  report,
  resumeAt,
  onError,
}: {
  containerRef: RefObject<HTMLElement | null>;
  videoId: string;
  report: ReportPosition;
  resumeAt: number | null;
  onError: () => void;
}) {
  const reportRef = useLatest(report);
  const onErrorRef = useLatest(onError);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let player: YouTubePlayer | null = null;
    let timer: number | undefined;
    let cancelled = false;
    const send = () => {
      if (player) reportRef.current(Math.floor(player.getCurrentTime()));
    };

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled) return;
        const mount = document.createElement('div');
        container.replaceChildren(mount);
        player = new YT.Player(mount, {
          videoId,
          playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
          events: {
            onReady: ({ target }) => {
              if (resumeAt) target.seekTo(resumeAt, true);
            },
            onStateChange: ({ data }) => {
              window.clearInterval(timer);
              send();
              if (data === YT_PLAYING) timer = window.setInterval(send, HEARTBEAT_INTERVAL_MS);
            },
          },
        });
      })
      .catch(() => {
        if (!cancelled) onErrorRef.current();
      });

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      player?.destroy();
    };
  }, [containerRef, onErrorRef, reportRef, resumeAt, videoId]);
}
