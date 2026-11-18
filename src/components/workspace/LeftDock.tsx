"use client";

import { StudioButton } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { useEditorStore } from "@/stores/editor-store";
import { useWorkspaceStore, type LeftPanel as LeftPanelKey } from "@/stores/workspace-store";
import { AudioPanel } from "./AudioPanel";
import { BrandPanel } from "./BrandPanel";
import { MediaLibrary } from "./MediaLibrary";
import { ScriptPanel } from "./ScriptPanel";

const items: { key: LeftPanelKey; label: string }[] = [
  { key: "media", label: "Media" },
  { key: "templates", label: "Templates" },
  { key: "audio", label: "Audio" },
  { key: "captions", label: "Script" },
  { key: "brand", label: "Brand" },
];

export function LeftDock() {
  const active = useWorkspaceStore((state) => state.leftPanel);
  const setActive = useWorkspaceStore((state) => state.setLeftPanel);
  const assets = useEditorStore((state) => state.assets);

  return (
    <Panel title="Workspace" className="flex min-h-0 flex-col">
      <nav aria-label="Workspace panels" className="flex flex-wrap gap-1 border-b border-studio-line px-3 py-2">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            aria-current={active === item.key ? "page" : undefined}
            onClick={() => setActive(item.key)}
            className={`rounded-md px-2 py-1 text-xs ${
              active === item.key
                ? "bg-studio-accent-soft text-white"
                : "text-studio-muted hover:text-studio-ink"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="min-h-0 flex-1 overflow-auto p-4">
        {active === "media" ? <MediaLibrary /> : null}
        {active === "templates" ? (
          <p className="studio-hint">Brand-locked templates are planned for a later milestone.</p>
        ) : null}
        {active === "audio" ? <AudioPanel /> : null}
        {active === "captions" ? <ScriptPanel /> : null}
        {active === "brand" ? <BrandPanel /> : null}
      </div>
      <div className="border-t border-studio-line px-4 py-2">
        <StudioButton disabled className="w-full" aria-label="Publish and schedule planned">
          Publish &amp; Schedule · planned
        </StudioButton>
        <p className="mt-2 studio-hint">{assets.length} local asset{assets.length === 1 ? "" : "s"}</p>
      </div>
    </Panel>
  );
}
