import { FPS, type Clip, type Track, type TrackKind } from "./types";

export const TRACK_ORDER: TrackKind[] = [
  "video",
  "ticker",
  "voiceover",
  "music",
  "caption",
];

export const TRACK_LABELS: Record<TrackKind, string> = {
  video: "Footage",
  ticker: "Ticker",
  voiceover: "Voice-over",
  music: "Music",
  caption: "Captions",
};

export function makeTracks(): Track[] {
  return TRACK_ORDER.map((kind) => ({
    id: `track-${kind}`,
    kind,
    name: TRACK_LABELS[kind],
    locked: false,
    muted: false,
  }));
}

export function framesToSeconds(frames: number, fps: number = FPS): number {
  return frames / fps;
}

export function secondsToFrames(seconds: number, fps: number = FPS): number {
  return Math.max(0, Math.round(seconds * fps));
}

export function formatTimecode(frame: number, fps: number = FPS): string {
  const safe = Math.max(0, Math.floor(frame));
  const frames = safe % fps;
  const totalSeconds = Math.floor(safe / fps);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  return [hours, minutes, seconds, frames]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
}

export function createClip(
  track: string,
  start: number,
  durationFrames: number,
  label: string,
  id: string,
): Clip {
  return {
    id,
    track,
    start,
    end: start + Math.max(1, Math.round(durationFrames)),
    sourceIn: 0,
    label,
    gain: 1,
    muted: false,
  };
}

export function splitClip(clip: Clip, atFrame: number): [Clip, Clip] | null {
  if (atFrame <= clip.start || atFrame >= clip.end) return null;
  return [
    { ...clip, end: atFrame },
    {
      ...clip,
      id: `${clip.id}-split-${atFrame}`,
      start: atFrame,
      sourceIn: clip.sourceIn + (atFrame - clip.start),
    },
  ];
}

export function clipEnd(clips: readonly Clip[]): number {
  return clips.reduce((max, clip) => Math.max(max, clip.end), 0);
}
