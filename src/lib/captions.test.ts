import { describe, expect, it } from "vitest";
import { framesToSrtTime, toSrt } from "./captions";

describe("caption export", () => {
  it("formats frame times as SRT timestamps", () => {
    expect(framesToSrtTime(0)).toBe("00:00:00,000");
    expect(framesToSrtTime(45)).toBe("00:00:01,500");
    expect(framesToSrtTime(3666)).toBe("00:02:02,200");
  });

  it("writes a deterministic SRT file", () => {
    const srt = toSrt([
      { id: "b", start: 45, end: 90, text: "Second" },
      { id: "a", start: 0, end: 30, text: "First" },
    ]);
    expect(srt).toBe(
      "1\n00:00:00,000 --> 00:00:01,000\nFirst\n\n2\n00:00:01,500 --> 00:00:03,000\nSecond\n",
    );
  });
});
