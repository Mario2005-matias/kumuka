import { mockConfig } from '../config';

export async function delay(ms?: number): Promise<void> {
  const { min, max } = mockConfig.latency;
  const duration = ms ?? Math.floor(Math.random() * (max - min + 1)) + min;
  await new Promise<void>((resolve) => setTimeout(resolve, duration));
}
