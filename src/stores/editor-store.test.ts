import { beforeEach, describe, expect, it } from "vitest";
import { makeTracks } from "@/lib/timeline";
import type { EditorSnapshot } from "@/lib/types";
import { useEditorStore } from "./editor-store";

const snapshot: EditorSnapshot = {
  project: {
    id: "project-test",
    title: "Bulletin",
    fps: 30,
    width: 1920,
    height: 1080,
    aspectRatio: "16:9",
  },
  assets: [{ id: "old", name: "old.mp4", kind: "video", size: 10 }],
  tracks: makeTracks(),
  clips: [
    {
      id: "video",
      track: "track-video",
      start: 0,
      end: 90,
      sourceIn: 0,
      label: "old.mp4",
      assetId: "old",
      gain: 1,
      muted: false,
    },
  ],
  script: [],
  captions: [],
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
    channelName: "Channel",
    primaryColor: "#dc2626",
    tickerBackground: "#b91c1c",
    showWatermark: false,
  },
  headline: "Headline",
};

describe("editor store", () => {
  beforeEach(() => useEditorStore.getState().hydrate(snapshot));

  it("replaces an asset without dropping the clip that uses it", () => {
    useEditorStore.getState().replaceAsset("old", {
      id: "new",
      name: "new.mp4",
      kind: "video",
      size: 20,
    });
    const state = useEditorStore.getState();
    expect(state.clips).toHaveLength(1);
    expect(state.clips[0].assetId).toBe("new");
    expect(state.assets.map((asset) => asset.id)).toEqual(["new"]);
  });

  it("records one history entry when a transient edit is committed", () => {
    const initial = useEditorStore.getState().past.length;
    const store = useEditorStore.getState();
    store.setProjectTitle("One");
    store.setProjectTitle("Two");
    expect(useEditorStore.getState().past).toHaveLength(initial);
    useEditorStore.getState().commitHistory();
    expect(useEditorStore.getState().past).toHaveLength(initial + 1);
    useEditorStore.getState().undo();
    expect(useEditorStore.getState().project.title).toBe("Two");
  });
});
