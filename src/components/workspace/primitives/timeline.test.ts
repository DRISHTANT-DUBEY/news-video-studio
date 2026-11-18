import { describe, expect, it, vi } from "vitest";
import { timeline } from "./timeline";
import type { Clip } from "@/lib/types";

const clip = (id: string, start: number, end: number): Clip => ({
  id,
  track: "track-video",
  start,
  end,
  sourceIn: 0,
  label: id,
  gain: 1,
  muted: false,
});

describe("timeline primitive", () => {
  it("splits a clip through the primitive api", () => {
    const onClipsChange = vi.fn();
    const instance = timeline({
      id: "timeline-test",
      defaultClips: [clip("clip-a", 0, 90)],
      durationFrames: 300,
      tracks: ["track-video"],
      onClipsChange,
    });

    expect(instance.api.split("clip-a", 30)).toBe(true);
    const clips = instance.get().clips;
    expect(clips).toHaveLength(2);
    expect(clips.find((item) => item.id === "clip-a")?.end).toBe(30);
    expect(clips.find((item) => item.id === "clip-a-split-30")?.sourceIn).toBe(30);
    expect(onClipsChange).toHaveBeenCalled();
  });

  it("refuses to split outside a clip", () => {
    const instance = timeline({
      id: "timeline-bounds",
      defaultClips: [clip("clip-a", 0, 90)],
      durationFrames: 300,
    });
    expect(instance.api.split("clip-a", 0)).toBe(false);
    expect(instance.api.split("missing", 30)).toBe(false);
  });
});
