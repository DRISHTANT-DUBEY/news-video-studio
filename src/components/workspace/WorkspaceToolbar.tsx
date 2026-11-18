"use client";

import { useEffect } from "react";
import { FieldRow, TextField } from "@/components/ui/field";
import { StudioButton } from "@/components/ui/button";
import {
  StudioToolbar,
  ToolbarAction,
  ToolbarActions,
  ToolbarDivider,
} from "@/components/ui/toolbar";
import { useEditorStore, selectCanRedo, selectCanUndo } from "@/stores/editor-store";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { ExportDialog } from "./ExportDialog";

export function WorkspaceToolbar() {
  const title = useEditorStore((state) => state.project.title);
  const setProjectTitle = useEditorStore((state) => state.setProjectTitle);
  const commitHistory = useEditorStore((state) => state.commitHistory);
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const canUndo = useEditorStore(selectCanUndo);
  const canRedo = useEditorStore(selectCanRedo);
  const notify = useWorkspaceStore((state) => state.notify);

  return (
    <div className="flex flex-col gap-3">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">NewsForge Studio</h1>
          <p className="studio-hint">Broadcast workspace · local project</p>
        </div>
        <p className="studio-hint">Local mode — no upload, no accounts connected</p>
      </header>
      <StudioToolbar label="Project actions">
        <div className="w-56">
          <FieldRow label="Project name">
            <TextField
              value={title}
              aria-label="Project name"
              onChange={(event) => setProjectTitle(event.target.value)}
              onBlur={commitHistory}
            />
          </FieldRow>
        </div>
        <ToolbarDivider />
        <ToolbarActions>
          <ToolbarAction onClick={undo} disabled={!canUndo} aria-label="Undo">
            Undo
          </ToolbarAction>
          <ToolbarAction onClick={redo} disabled={!canRedo} aria-label="Redo">
            Redo
          </ToolbarAction>
        </ToolbarActions>
        <ToolbarDivider />
        <ToolbarAction onClick={() => notify("Autosave is local-only and not connected to a server.", "info")}>
          Autosave status
        </ToolbarAction>
        <ExportDialog />
        <StudioButton disabled className="opacity-50">
          Publish &amp; Schedule · planned
        </StudioButton>
      </StudioToolbar>
    </div>
  );
}

export function NoticeBanner() {
  const notice = useWorkspaceStore((state) => state.notice);
  const clear = useWorkspaceStore((state) => state.clearNotice);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(clear, 5000);
    return () => clearTimeout(timer);
  }, [notice, clear]);

  if (!notice) return null;
  return (
    <div role="status" className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-studio-line bg-studio-panel px-4 py-3 text-sm shadow-xl">
      <p>{notice.message}</p>
      <button type="button" className="mt-2 text-xs text-studio-muted underline" onClick={clear}>
        Dismiss
      </button>
    </div>
  );
}
