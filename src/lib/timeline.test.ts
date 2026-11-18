import { describe, expect, it } from "vitest";
import {
  clipEnd,
  createClip,
  formatTimecode,
  framesToSeconds,
  secondsToFrames,
  splitClip,
} from "./timeline";

describe("timeline fixtures", () => {
  const clip = createClip("track-video", 30, 90, "Shot A", "clip-a");

  it("converts frames and seconds without drift at 30 fps", () => {
    expect(framesToSeconds(45)).toBe(1.5);
    expect(secondsToFrames(1.5)).toBe(45);
    expect(formatTimecode(45)).toBe("00:00:01:15");
  });

  it("splits a clip into two frame-accurate parts", () => {
    const split = splitClip(clip, 60);
    expect(split).not.toBeNull();
    expect(split?.[0]).toMatchObject({ start: 30, end: 60, sourceIn: 0 });
    expect(split?.[1]).toMatchObject({ start: 60, end: 120, sourceIn: 30 });
    expect(splitClip(clip, 30)).toBeNull();
  });

  it("reports the end of the timeline", () => {
    expect(clipEnd([clip, { ...clip, id: "b", start: 100, end: 210 }])).toBe(210);
  });
});
