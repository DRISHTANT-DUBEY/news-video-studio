import type { Asset, MediaKind } from "./types";

type Entry = { file: File; url: string };

const entries = new Map<string, Entry>();

function createId(): string {
  return `asset-${Math.random().toString(36).slice(2, 10)}`;
}

export function registerMedia(file: File, kind: MediaKind): Asset {
  const id = createId();
  entries.set(id, { file, url: URL.createObjectURL(file) });
  return { id, name: file.name, kind, size: file.size };
}

export function getMediaUrl(id: string): string | undefined {
  return entries.get(id)?.url;
}

export function releaseMedia(id: string): void {
  const entry = entries.get(id);
  if (entry) URL.revokeObjectURL(entry.url);
  entries.delete(id);
}

export function releaseAllMedia(): void {
  for (const id of [...entries.keys()]) releaseMedia(id);
}

let seekMediaTo: (frame: number) => void = () => {};

export function registerMediaSeeker(seek: (frame: number) => void): () => void {
  seekMediaTo = seek;
  return () => {
    seekMediaTo = () => {};
  };
}

export function seekMedia(frame: number): void {
  seekMediaTo(frame);
}
