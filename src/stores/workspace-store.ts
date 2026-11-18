import { create } from "zustand";

export type LeftPanel = "media" | "templates" | "audio" | "captions" | "brand";
export type InspectorTab = "clip" | "ticker" | "audio" | "caption" | "export";

type Notice = { tone: "info" | "warning" | "error"; message: string } | null;

interface WorkspaceState {
  leftPanel: LeftPanel;
  inspectorTab: InspectorTab;
  exportOpen: boolean;
  timelineZoom: number;
  notice: Notice;
  setLeftPanel(panel: LeftPanel): void;
  setInspectorTab(tab: InspectorTab): void;
  setExportOpen(open: boolean): void;
  setTimelineZoom(zoom: number): void;
  notify(message: string, tone?: "info" | "warning" | "error"): void;
  clearNotice(): void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  leftPanel: "media",
  inspectorTab: "clip",
  exportOpen: false,
  timelineZoom: 6,
  notice: null,
  setLeftPanel: (leftPanel) => set({ leftPanel }),
  setInspectorTab: (inspectorTab) => set({ inspectorTab }),
  setExportOpen: (exportOpen) => set({ exportOpen }),
  setTimelineZoom: (timelineZoom) =>
    set({ timelineZoom: Math.max(2, Math.min(24, timelineZoom)) }),
  notify: (message, tone = "info") => set({ notice: { message, tone } }),
  clearNotice: () => set({ notice: null }),
}));
