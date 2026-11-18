import { FPS, type Caption } from "./types";

function pad(value: number, length = 2): string {
  return String(value).padStart(length, "0");
}

export function framesToSrtTime(frame: number, fps: number = FPS): string {
  const safe = Math.max(0, Math.floor(frame));
  const milliseconds = Math.floor((safe / fps) * 1000);
  const hours = Math.floor(milliseconds / 3_600_000);
  const minutes = Math.floor(milliseconds / 60_000) % 60;
  const seconds = Math.floor(milliseconds / 1000) % 60;
  const remainder = milliseconds % 1000;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},${pad(remainder, 3)}`;
}

export function toSrt(captions: readonly Caption[], fps: number = FPS): string {
  return captions
    .slice()
    .sort((a, b) => a.start - b.start)
    .map((caption, index) =>
      [
        String(index + 1),
        `${framesToSrtTime(caption.start, fps)} --> ${framesToSrtTime(caption.end, fps)}`,
        caption.text,
        "",
      ].join("\n"),
    )
    .join("\n");
}

export function captionsInRange(
  captions: readonly Caption[],
  frame: number,
): Caption[] {
  return captions.filter((caption) => frame >= caption.start && frame < caption.end);
}
