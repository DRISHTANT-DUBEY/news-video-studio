import type { AudioSettings } from "./types";

export function dbToGain(decibels: number): number {
  return Math.pow(10, decibels / 20);
}

export function gainToDb(gain: number): number {
  if (gain <= 0) return -Infinity;
  return 20 * Math.log10(gain);
}

export function effectiveMusicGain(
  settings: Pick<
    AudioSettings,
    "musicGain" | "duckingEnabled" | "duckingReductionDb"
  >,
  voiceoverActive: boolean,
): number {
  if (!voiceoverActive || !settings.duckingEnabled) return settings.musicGain;
  return settings.musicGain * dbToGain(-Math.abs(settings.duckingReductionDb));
}

export function fadeMultiplier(
  frame: number,
  start: number,
  end: number,
  fadeInFrames: number,
  fadeOutFrames: number,
): number {
  if (frame < start || frame >= end) return 0;
  const sinceStart = frame - start;
  const untilEnd = end - frame;
  const fadeIn =
    fadeInFrames <= 0 ? 1 : Math.min(1, sinceStart / fadeInFrames);
  const fadeOut =
    fadeOutFrames <= 0 ? 1 : Math.min(1, untilEnd / fadeOutFrames);
  return Math.max(0, Math.min(fadeIn, fadeOut));
}

export function mixLevel(
  settings: AudioSettings,
  voiceoverActive: boolean,
): { source: number; voiceover: number; music: number } {
  return {
    source: settings.sourceGain,
    voiceover: settings.voiceoverGain,
    music: effectiveMusicGain(settings, voiceoverActive),
  };
}
