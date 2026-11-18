"use client";

import { createParts } from "@ui-sdk/react/primitive";
import { timeline } from "./timeline";

export const parts = createParts(timeline, {
  root: "div",
  track: "div",
  clip: "div",
  handle: "span",
});

export const TimelineRoot = parts.Root;
export const TimelineTrackPart = parts.Track;
export const TimelineClipPart = parts.Clip;
export const TimelineHandlePart = parts.Handle;
