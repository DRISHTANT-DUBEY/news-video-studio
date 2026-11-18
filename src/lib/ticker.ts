export const TICKER_SPEED_PX_PER_SECOND = 140;
export const TICKER_GAP_PX = 120;
export const TICKER_HEIGHT_RATIO = 0.1;

export function tickerPosition(
  timeSeconds: number,
  textWidth: number,
  width: number,
  speed: number = TICKER_SPEED_PX_PER_SECOND,
  gap: number = TICKER_GAP_PX,
): number {
  const period = textWidth + gap;
  if (period <= 0) return width;
  const offset = ((Math.max(0, timeSeconds) * speed) % period + period) % period;
  return width - offset;
}

export function tickerGeometry(
  timeSeconds: number,
  textWidth: number,
  width: number,
  height: number,
) {
  const tickerHeight = Math.round(height * TICKER_HEIGHT_RATIO);
  return {
    top: height - tickerHeight,
    height: tickerHeight,
    badgeWidth: Math.round(width * 0.17),
    font: Math.round(tickerHeight * 0.42),
    x: tickerPosition(timeSeconds, textWidth, width),
    period: textWidth + TICKER_GAP_PX,
  };
}

export function drawTicker(
  ctx: CanvasRenderingContext2D,
  headline: string,
  time: number,
  width: number,
  height: number,
): void {
  const geometry = tickerGeometry(time, 0, width, height);
  const left = geometry.badgeWidth + 12;

  ctx.fillStyle = "#b91c1c";
  ctx.fillRect(0, geometry.top, width, geometry.height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, geometry.top, geometry.badgeWidth, geometry.height);

  ctx.font = `bold ${geometry.font}px Arial, sans-serif`;
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#991b1b";
  ctx.fillText("BREAKING", 16, geometry.top + geometry.height / 2);

  ctx.save();
  ctx.beginPath();
  ctx.rect(left, geometry.top, width - left, geometry.height);
  ctx.clip();
  ctx.fillStyle = "#ffffff";

  const text = headline.trim() || "LATEST NEWS";
  const textWidth = ctx.measureText(text).width;
  const period = textWidth + TICKER_GAP_PX;
  let x = tickerPosition(time, textWidth, width);
  while (x > left - period) x -= period;
  while (x < width) {
    ctx.fillText(text, x, geometry.top + geometry.height / 2);
    x += period;
  }
  ctx.restore();
}
