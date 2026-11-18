import { describe, expect, it } from "vitest";
import { FPS } from "./types";
import { TICKER_GAP_PX, tickerGeometry, tickerPosition } from "./ticker";

describe("ticker geometry", () => {
  it("is driven by media time, not wall clock", () => {
    const width = 1280;
    expect(tickerPosition(0, 400, width)).toBe(width);
    const period = 400 + TICKER_GAP_PX;
    expect(tickerPosition(period / 140, 400, width)).toBeCloseTo(width, 6);
  });

  it("keeps a constant period for seamless repetition", () => {
    const geometry = tickerGeometry(1.5, 400, 1280, 720);
    expect(geometry.period).toBe(400 + TICKER_GAP_PX);
    expect(geometry.top).toBe(648);
    expect(geometry.height).toBe(72);
    expect(geometry.badgeWidth).toBe(Math.round(1280 * 0.17));
  });

  it("uses the same frame time that export will use", () => {
    const frame = 45;
    expect(frame / FPS).toBe(1.5);
    expect(tickerPosition(frame / FPS, 400, 1280)).toBe(
      tickerPosition(1.5, 400, 1280),
    );
  });
});
