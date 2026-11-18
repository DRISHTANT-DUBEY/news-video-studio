import { describe, expect, it } from "vitest";
import {
  dbToGain,
  effectiveMusicGain,
  fadeMultiplier,
  gainToDb,
  mixLevel,
} from "./audio";

const settings = {
  sourceGain: 1,
  voiceoverGain: 0.9,
  musicGain: 0.2,
  duckingEnabled: true,
  duckingReductionDb: 12,
  fadeInFrames: 10,
  fadeOutFrames: 20,
};

describe("audio math", () => {
  it("round-trips decibels and gain", () => {
    expect(dbToGain(0)).toBeCloseTo(1);
    expect(gainToDb(dbToGain(-12))).toBeCloseTo(-12);
  });

  it("ducks music only while voice-over is active", () => {
    expect(effectiveMusicGain(settings, false)).toBeCloseTo(0.2);
    expect(effectiveMusicGain(settings, true)).toBeCloseTo(0.2 * dbToGain(-12));
    expect(mixLevel(settings, true).music).toBeCloseTo(0.2 * dbToGain(-12));
  });

  it("applies fades at clip edges", () => {
    expect(fadeMultiplier(0, 0, 100, 10, 20)).toBe(0);
    expect(fadeMultiplier(5, 0, 100, 10, 20)).toBe(0.5);
    expect(fadeMultiplier(50, 0, 100, 10, 20)).toBe(1);
    expect(fadeMultiplier(95, 0, 100, 10, 20)).toBe(0.25);
    expect(fadeMultiplier(100, 0, 100, 10, 20)).toBe(0);
  });
});
