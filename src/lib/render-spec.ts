import type {
  AudioSettings,
  BrandKit,
  Caption,
  Clip,
  EditorSnapshot,
  ExportVariant,
  ProjectMeta,
  Track,
} from "./types";

export const RENDER_SPEC_VERSION = 1 as const;

export interface RenderSpecV1 {
  version: typeof RENDER_SPEC_VERSION;
  project: ProjectMeta;
  variant: ExportVariant;
  headline: string;
  tracks: Track[];
  clips: Clip[];
  captions: Caption[];
  audio: AudioSettings;
  brand: BrandKit;
  sourceAssetIds: string[];
}

export function buildRenderSpec(
  state: EditorSnapshot,
  variant: ExportVariant,
): RenderSpecV1 {
  return {
    version: RENDER_SPEC_VERSION,
    project: state.project,
    variant,
    headline: state.headline,
    tracks: state.tracks,
    clips: state.clips,
    captions: state.captions,
    audio: state.audio,
    brand: state.brand,
    sourceAssetIds: [
      ...new Set(
        state.clips
          .map((clip) => clip.assetId)
          .filter((id): id is string => Boolean(id)),
      ),
    ],
  };
}

export function fingerprintSpec(spec: RenderSpecV1): string {
  const text = JSON.stringify(spec);
  let hash = 5381;
  for (let index = 0; index < text.length; index += 1) {
    hash = ((hash << 5) + hash + text.charCodeAt(index)) | 0;
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}
