import { create } from "zustand";
import { nextId } from "@/lib/ids";
import { clipEnd, createClip, makeTracks, splitClip } from "@/lib/timeline";
import { FPS } from "@/lib/types";
import type {
  Asset,
  AudioSettings,
  BrandKit,
  Caption,
  Clip,
  EditorSnapshot,
  ExportVariant,
  ProjectMeta,
  RenderSettings,
  ScriptSegment,
  Track,
} from "@/lib/types";

const HISTORY_LIMIT = 50;

const initialProject: ProjectMeta = {
  id: "project-local",
  title: "Untitled bulletin",
  fps: FPS,
  width: 1920,
  height: 1080,
  aspectRatio: "16:9",
};

const initialAudio: AudioSettings = {
  sourceGain: 1,
  voiceoverGain: 1,
  musicGain: 0.18,
  duckingEnabled: true,
  duckingReductionDb: 12,
  fadeInFrames: 8,
  fadeOutFrames: 15,
};

const initialBrand: BrandKit = {
  channelName: "Newsroom Channel",
  primaryColor: "#dc2626",
  tickerBackground: "#b91c1c",
  showWatermark: false,
};

const initialRenderSettings: RenderSettings = {
  mode: "auto",
  variant: "landscape",
  videoCodec: "h264",
  audioCodec: "aac",
};

function initialClips(): Clip[] {
  return [
    {
      ...createClip("track-video", 0, 450, "Sample footage — import to replace", "clip-video-sample"),
      sourceIn: 0,
    },
    createClip("track-ticker", 0, 450, "Breaking news ticker", "clip-ticker"),
  ];
}

function normalizePlayhead(frame: number, clips: Clip[]): number {
  return Math.max(0, Math.min(Math.max(900, clipEnd(clips)), Math.round(frame)));
}

function snapshotOf(state: EditorState): EditorSnapshot {
  return {
    project: state.project,
    assets: state.assets,
    tracks: state.tracks,
    clips: state.clips,
    script: state.script,
    captions: state.captions,
    audio: state.audio,
    renderSettings: state.renderSettings,
    brand: state.brand,
    headline: state.headline,
  };
}

export interface EditorState extends EditorSnapshot {
  playheadFrame: number;
  selectedClipIds: string[];
  past: EditorSnapshot[];
  future: EditorSnapshot[];

  setProjectTitle(title: string): void;
  setHeadline(headline: string): void;
  setAspectRatio(aspectRatio: ProjectMeta["aspectRatio"]): void;
  setVariant(variant: ExportVariant): void;
  setRenderMode(mode: RenderSettings["mode"]): void;
  setPlayhead(frame: number): void;
  stepPlayhead(delta: number): void;
  setSelectedClips(ids: string[]): void;
  setClips(clips: Clip[], history?: boolean): void;
  addClip(clip: Clip): void;
  removeClip(id: string): void;
  splitSelected(atFrame: number): void;
  setClipGain(id: string, gain: number): void;
  toggleTrackMute(id: string): void;
  toggleTrackLock(id: string): void;
  addAsset(asset: Asset): void;
  removeAsset(id: string): void;
  setScript(segments: ScriptSegment[]): void;
  addScriptSegment(text: string): void;
  updateScriptSegment(id: string, text: string): void;
  removeScriptSegment(id: string): void;
  setCaptions(captions: Caption[]): void;
  addCaption(caption: Caption): void;
  updateCaption(id: string, patch: Partial<Caption>): void;
  removeCaption(id: string): void;
  setAudio(patch: Partial<AudioSettings>): void;
  setBrand(patch: Partial<BrandKit>): void;
  replaceAsset(oldId: string, asset: Asset): void;
  commitHistory(): void;
  undo(): void;
  redo(): void;
  exportSnapshot(): EditorSnapshot;
  hydrate(snapshot: EditorSnapshot): void;
}

export const useEditorStore = create<EditorState>((set, get) => {
  const record = (state: EditorState) => ({
    past: [...state.past, snapshotOf(state)].slice(-HISTORY_LIMIT),
    future: [] as EditorSnapshot[],
  });

  return {
    project: initialProject,
    assets: [],
    tracks: makeTracks(),
    clips: initialClips(),
    script: [],
    captions: [],
    audio: initialAudio,
    brand: initialBrand,
    renderSettings: initialRenderSettings,
    headline: "Breaking news: Latest updates from the newsroom",
    playheadFrame: 0,
    selectedClipIds: [],
    past: [],
    future: [],

    setProjectTitle: (title) =>
      set((state) => ({ project: { ...state.project, title } })),
    setHeadline: (headline) => set({ headline }),
    setAspectRatio: (aspectRatio) =>
      set((state) => ({
        project: {
          ...state.project,
          aspectRatio,
          width: aspectRatio === "9:16" ? 1080 : 1920,
          height: aspectRatio === "9:16" ? 1920 : 1080,
        },
        renderSettings: {
          ...state.renderSettings,
          variant: (aspectRatio === "9:16" ? "vertical" : "landscape") as ExportVariant,
        },
        ...record(state),
      })),
    setVariant: (variant) =>
      set((state) => ({
        renderSettings: { ...state.renderSettings, variant },
        project: {
          ...state.project,
          aspectRatio: variant === "vertical" ? "9:16" : "16:9",
          width: variant === "vertical" ? 1080 : 1920,
          height: variant === "vertical" ? 1920 : 1080,
        },
        ...record(state),
      })),
    setRenderMode: (mode) =>
      set((state) => ({
        renderSettings: { ...state.renderSettings, mode },
        ...record(state),
      })),
    setPlayhead: (frame) =>
      set((state) => ({
        playheadFrame: normalizePlayhead(frame, state.clips),
      })),
    stepPlayhead: (delta) => get().setPlayhead(get().playheadFrame + delta),
    setSelectedClips: (ids) => set({ selectedClipIds: ids }),

    setClips: (clips, history = true) =>
      set((state) => ({
        clips,
        selectedClipIds: state.selectedClipIds.filter((id) =>
          clips.some((clip) => clip.id === id),
        ),
        ...(history ? record(state) : {}),
      })),
    addClip: (clip) =>
      set((state) => ({
        clips: [...state.clips, clip],
        selectedClipIds: [clip.id],
        ...record(state),
      })),
    removeClip: (id) =>
      set((state) => ({
        clips: state.clips.filter((clip) => clip.id !== id),
        selectedClipIds: state.selectedClipIds.filter((clipId) => clipId !== id),
        ...record(state),
      })),
    splitSelected: (atFrame) => {
      const state = get();
      const selected = state.clips.find(
        (clip) => clip.id === state.selectedClipIds[0],
      );
      if (!selected) return;
      const parts = splitClip(selected, atFrame);
      if (!parts) return;
      set({
        clips: state.clips.flatMap((clip) =>
          clip.id === selected.id ? parts : [clip],
        ),
        selectedClipIds: [parts[1].id],
        ...record(state),
      });
    },
    setClipGain: (id, gain) =>
      set((state) => ({
        clips: state.clips.map((clip) =>
          clip.id === id ? { ...clip, gain: Math.max(0, Math.min(2, gain)) } : clip,
        ),
      })),
    toggleTrackMute: (id) =>
      set((state) => ({
        tracks: state.tracks.map((track) =>
          track.id === id ? { ...track, muted: !track.muted } : track,
        ),
        ...record(state),
      })),
    toggleTrackLock: (id) =>
      set((state) => ({
        tracks: state.tracks.map((track) =>
          track.id === id ? { ...track, locked: !track.locked } : track,
        ),
        ...record(state),
      })),

    addAsset: (asset) =>
      set((state) => ({ assets: [...state.assets, asset], ...record(state) })),
    removeAsset: (id) =>
      set((state) => ({
        assets: state.assets.filter((asset) => asset.id !== id),
        clips: state.clips.filter((clip) => clip.assetId !== id),
        ...record(state),
      })),
    replaceAsset: (oldId, asset) =>
      set((state) => ({
        assets: [...state.assets.filter((item) => item.id !== oldId), asset],
        clips: state.clips.map((clip) =>
          clip.assetId === oldId ? { ...clip, assetId: asset.id } : clip,
        ),
        ...record(state),
      })),

    setScript: (script) => set((state) => ({ script, ...record(state) })),
    addScriptSegment: (text) =>
      set((state) => ({
        script: [...state.script, { id: nextId("script"), text }],
        ...record(state),
      })),
    updateScriptSegment: (id, text) =>
      set((state) => ({
        script: state.script.map((segment) =>
          segment.id === id ? { ...segment, text } : segment,
        ),
      })),
    removeScriptSegment: (id) =>
      set((state) => ({
        script: state.script.filter((segment) => segment.id !== id),
        ...record(state),
      })),

    setCaptions: (captions) => set((state) => ({ captions, ...record(state) })),
    addCaption: (caption) =>
      set((state) => ({ captions: [...state.captions, caption], ...record(state) })),
    updateCaption: (id, patch) =>
      set((state) => ({
        captions: state.captions.map((caption) =>
          caption.id === id ? { ...caption, ...patch } : caption,
        ),
      })),
    removeCaption: (id) =>
      set((state) => ({
        captions: state.captions.filter((caption) => caption.id !== id),
        ...record(state),
      })),

    setAudio: (patch) =>
      set((state) => ({ audio: { ...state.audio, ...patch } })),
    setBrand: (patch) =>
      set((state) => ({ brand: { ...state.brand, ...patch } })),
    commitHistory: () => set((state) => record(state)),

    undo: () => {
      const state = get();
      const previous = state.past.at(-1);
      if (!previous) return;
      set({
        ...previous,
        past: state.past.slice(0, -1),
        future: [snapshotOf(state), ...state.future].slice(0, HISTORY_LIMIT),
        playheadFrame: normalizePlayhead(state.playheadFrame, previous.clips),
        selectedClipIds: [],
      });
    },
    redo: () => {
      const state = get();
      const next = state.future[0];
      if (!next) return;
      set({
        ...next,
        past: [...state.past, snapshotOf(state)].slice(-HISTORY_LIMIT),
        future: state.future.slice(1),
        playheadFrame: normalizePlayhead(state.playheadFrame, next.clips),
        selectedClipIds: [],
      });
    },
    exportSnapshot: () => snapshotOf(get()),
    hydrate: (snapshot) =>
      set({
        ...snapshot,
        playheadFrame: normalizePlayhead(0, snapshot.clips),
        selectedClipIds: [],
        past: [],
        future: [],
      }),
  };
});

export const selectCanUndo = (state: EditorState) => state.past.length > 0;
export const selectCanRedo = (state: EditorState) => state.future.length > 0;
export const selectDurationFrames = (state: EditorState) =>
  clipEnd(state.clips);
export const selectTracks = (state: EditorState): Track[] => state.tracks;
