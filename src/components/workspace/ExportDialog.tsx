"use client";

import { StudioDialog } from "@/components/ui/dialog";
import { StatusNote } from "@/components/ui/panel";
import { buildRenderSpec, fingerprintSpec } from "@/lib/render-spec";
import { hasRenderer } from "@/services";
import { useEditorStore } from "@/stores/editor-store";
import { useWorkspaceStore } from "@/stores/workspace-store";

export function ExportDialog() {
  const open = useWorkspaceStore((state) => state.exportOpen);
  const setOpen = useWorkspaceStore((state) => state.setExportOpen);
  const state = useEditorStore();
  const spec = buildRenderSpec(state, state.renderSettings.variant);
  const rendererReady = hasRenderer();

  return (
    <StudioDialog
      open={open}
      onOpenChange={setOpen}
      title="Export center"
      description="Review the render contract before an engine is connected."
      triggerLabel="Export"
    >
      <div className="flex flex-col gap-3 text-sm">
        <dl className="grid grid-cols-2 gap-2 text-xs">
          <dt className="text-studio-muted">Variant</dt>
          <dd>{spec.variant === "vertical" ? "1080 × 1920 · 9:16" : "1920 × 1080 · 16:9"}</dd>
          <dt className="text-studio-muted">Mode</dt>
          <dd>{state.renderSettings.mode}</dd>
          <dt className="text-studio-muted">Clips</dt>
          <dd>{spec.clips.length}</dd>
          <dt className="text-studio-muted">Spec fingerprint</dt>
          <dd className="font-mono">{fingerprintSpec(spec)}</dd>
        </dl>
        <StatusNote tone={rendererReady ? "info" : "warning"}>
          {rendererReady
            ? "A renderer is configured. Job submission is wired through src/services."
            : "MP4 export is disabled: no render engine is connected. This dialog only shows the deterministic render spec."}
        </StatusNote>
        <button type="button" className="studio-button opacity-50" disabled>
          Assemble &amp; Render · engine pending
        </button>
      </div>
    </StudioDialog>
  );
}
