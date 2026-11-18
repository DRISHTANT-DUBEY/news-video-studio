export const FPS = 30;

export type AspectRatio = "16:9" | "9:16";
export type TrackKind = "video" | "ticker" | "voiceover" | "music" | "caption";
export type MediaKind = "video" | "audio" | "image";
export type RenderMode = "auto" | "local" | "cloud";
export type ExportVariant = "landscape" | "vertical";
export type JobStatus =
  | "idle"
  | "queued"
  | "rendering"
  | "completed"
  | "failed"
  | "cancelled";

export interface ProjectMeta {
  id: string;
  title: string;
  fps: typeof FPS;
  width: number;
  height: number;
  aspectRatio: AspectRatio;
}

export interface Asset {
  id: string;
  name: string;
  kind: MediaKind;
  size: number;
  durationSeconds?: number;
}

export interface Clip {
  id: string;
  track: string;
  start: number;
  end: number;
  sourceIn: number;
  label: string;
  assetId?: string;
  gain?: number;
  muted?: boolean;
  text?: string;
}

export interface Track {
  id: string;
  kind: TrackKind;
  name: string;
  locked: boolean;
  muted: boolean;
}

export interface ScriptSegment {
  id: string;
  text: string;
  clipId?: string;
}

export interface Caption {
  id: string;
  start: number;
  end: number;
  text: string;
  emphasis?: boolean;
}

export interface BrandKit {
  channelName: string;
  primaryColor: string;
  tickerBackground: string;
  showWatermark: boolean;
  introAssetId?: string;
  outroAssetId?: string;
}

export interface AudioSettings {
  sourceGain: number;
  voiceoverGain: number;
  musicGain: number;
  duckingEnabled: boolean;
  duckingReductionDb: number;
  fadeInFrames: number;
  fadeOutFrames: number;
}

export interface RenderSettings {
  mode: RenderMode;
  variant: ExportVariant;
  videoCodec: "h264";
  audioCodec: "aac";
}

export interface RenderJob {
  id: string;
  status: JobStatus;
  progress: number;
  outputAssetId?: string;
  error?: string;
}

export type EditorSnapshot = {
  project: ProjectMeta;
  assets: Asset[];
  tracks: Track[];
  clips: Clip[];
  script: ScriptSegment[];
  captions: Caption[];
  audio: AudioSettings;
  renderSettings: RenderSettings;
  brand: BrandKit;
  headline: string;
};
