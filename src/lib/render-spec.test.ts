import { describe, expect, it } from "vitest";
import { buildRenderSpec, fingerprintSpec } from "./render-spec";
import { makeTracks } from "./timeline";
import type { EditorSnapshot } from "./types";

const snapshot: EditorSnapshot = {
  project: {
    id: "project-test",
    title: "Test bulletin",
    fps: 30,
    width: 1920,
    height: 1080,
    aspectRatio: "16:9",
  },
  assets: [{ id: "video-1", name: "clip.mp4", kind: "video", size: 100 }],
  tracks: makeTracks(),
  clips: [
    {
      id: "clip-1",
      track: "track-video",
      start: 0,
      end: 90,
      sourceIn: 0,
      label: "Footage",
      assetId: "video-1",
      gain: 1,
      muted: false,
    },
  ],
  script: [{ id: "s1", text: "Story" }],
  captions: [{ id: "c1", start: 0, end: 30, text: "Caption" }],
  audio: {
    sourceGain: 1,
    voiceoverGain: 1,
    musicGain: 0.18,
    duckingEnabled: true,
    duckingReductionDb: 12,
    fadeInFrames: 8,
    fadeOutFrames: 15,
  },
  renderSettings: {
    mode: "local",
    variant: "landscape",
    videoCodec: "h264",
    audioCodec: "aac",
  },
  brand: {
    channelName: "Test Channel",
    primaryColor: "#dc2626",
    tickerBackground: "#b91c1c",
    showWatermark: false,
  },
  headline: "Breaking news",
};

describe("render spec", () => {
  it("is deterministic and contains only serializable data", () => {
    const first = buildRenderSpec(snapshot, "landscape");
    const second = buildRenderSpec(snapshot, "landscape");
    expect(first).toEqual(second);
    expect(fingerprintSpec(first)).toBe(fingerprintSpec(second));
    expect(first.sourceAssetIds).toEqual(["video-1"]);
    expect(JSON.stringify(first)).not.toContain("blob:");
  });

  it("changes fingerprint when the variant changes", () => {
    expect(fingerprintSpec(buildRenderSpec(snapshot, "landscape"))).not.toBe(
      fingerprintSpec(buildRenderSpec(snapshot, "vertical")),
    );
  });
});
