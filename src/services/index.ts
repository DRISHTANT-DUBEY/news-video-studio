import type { RenderSpecV1 } from "@/lib/render-spec";
import type { Asset, MediaKind, RenderJob } from "@/lib/types";

export type RenderProgressLike = {
  phase:
    | "preparing"
    | "normalizing"
    | "compositing"
    | "encoding"
    | "muxing"
    | "finalizing";
  percent: number;
};

export interface BackendServices {
  auth?: {
    currentUser(): Promise<{ id: string; displayName: string } | null>;
  };
  storage?: {
    put(file: File, kind: MediaKind): Promise<Asset>;
    remove(assetId: string): Promise<void>;
  };
  renderer?: {
    start(
      spec: RenderSpecV1,
      onProgress: (progress: RenderProgressLike) => void,
      signal: AbortSignal,
    ): Promise<RenderJob>;
    cancel(jobId: string): Promise<void>;
  };
  publishing?: {
    status(): Promise<"unconfigured">;
  };
}

let configured: BackendServices = {};

export function configureServices(services: BackendServices): void {
  configured = services;
}

export function getServices(): Readonly<BackendServices> {
  return configured;
}

export function hasRenderer(): boolean {
  return Boolean(configured.renderer);
}

export function hasStorage(): boolean {
  return Boolean(configured.storage);
}
