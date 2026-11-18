"use client";

import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
} from "@ui-sdk/react/resizable";
import { useIsCompact } from "@/hooks/use-is-compact";
import { InspectorPanel } from "./InspectorPanel";
import { LeftDock } from "./LeftDock";
import { ProgramMonitor } from "./ProgramMonitor";
import { TimelineEditor } from "./TimelineEditor";
import { NoticeBanner, WorkspaceToolbar } from "./WorkspaceToolbar";

export default function WorkspaceShell() {
  const compact = useIsCompact();

  return (
    <main className="mx-auto flex min-h-screen max-w-[1800px] flex-col gap-4 p-4 md:p-6">
      <WorkspaceToolbar />

      {compact ? (
        <div className="flex flex-col gap-4">
          <LeftDock />
          <ProgramMonitor />
          <InspectorPanel />
          <TimelineEditor />
        </div>
      ) : (
        <Resizable
          defaultLayout={[18, 55, 27]}
          className="h-[calc(100vh-9.5rem)] min-h-[640px] gap-1"
        >
          <ResizablePanel id="workspace-left" minSize={14} maxSize={30}>
            <div className="h-full min-h-0 overflow-auto">
              <LeftDock />
            </div>
          </ResizablePanel>
          <ResizableHandle aria-label="Resize workspace panels" />
          <ResizablePanel id="workspace-center" minSize={35}>
            <Resizable orientation="vertical" defaultLayout={[68, 32]} className="h-full gap-1">
              <ResizablePanel id="program-monitor" minSize={40}>
                <div className="h-full min-h-0 overflow-auto">
                  <ProgramMonitor />
                </div>
              </ResizablePanel>
              <ResizableHandle aria-label="Resize timeline" />
              <ResizablePanel id="timeline" minSize={22}>
                <div className="h-full min-h-0 overflow-auto">
                  <TimelineEditor />
                </div>
              </ResizablePanel>
            </Resizable>
          </ResizablePanel>
          <ResizableHandle aria-label="Resize inspector" />
          <ResizablePanel id="workspace-right" minSize={20} maxSize={36}>
            <div className="h-full min-h-0 overflow-auto">
              <InspectorPanel />
            </div>
          </ResizablePanel>
        </Resizable>
      )}

      <NoticeBanner />
    </main>
  );
}
