"use client";

import { Listbox, ListboxItem } from "@ui-sdk/react/listbox";
import { useState, type ChangeEvent } from "react";
import { StudioButton } from "@/components/ui/button";
import { StatusNote } from "@/components/ui/panel";
import { registerMedia, releaseMedia } from "@/lib/media-registry";
import { useEditorStore } from "@/stores/editor-store";

export function MediaLibrary() {
  const assets = useEditorStore((state) => state.assets);
  const addAsset = useEditorStore((state) => state.addAsset);
  const removeAsset = useEditorStore((state) => state.removeAsset);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState("");

  const importFile = (file?: File, kind: "video" | "audio" | "image" = "video") => {
    if (!file) return;
    if (file.size > 1024 ** 3) {
      setError("Files must be under 1 GB.");
      return;
    }
    const asset = registerMedia(file, kind);
    addAsset(asset);
    setSelected(asset.id);
    setError("");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="studio-button-secondary cursor-pointer text-center">
          Import video
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              importFile(event.target.files?.[0], "video");
              event.target.value = "";
            }}
          />
        </label>
        <label className="studio-button-secondary cursor-pointer text-center">
          Import audio
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              importFile(event.target.files?.[0], "audio");
              event.target.value = "";
            }}
          />
        </label>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-studio-muted">
          Assets
        </h3>
        {assets.length === 0 ? (
          <StatusNote>No local assets yet. Imported files stay on this device.</StatusNote>
        ) : (
          <Listbox
            aria-label="Local assets"
            value={selected ?? undefined}
            onValueChange={(value) => setSelected(value ?? null)}
            className="flex max-h-64 flex-col gap-1 overflow-auto"
          >
            {assets.map((asset) => (
              <ListboxItem
                key={asset.id}
                value={asset.id}
                className="cursor-default rounded-md px-3 py-2 text-xs data-[highlighted]:bg-studio-panel-alt"
              >
                <span className="block truncate">{asset.name}</span>
                <span className="text-studio-muted">{asset.kind}</span>
              </ListboxItem>
            ))}
          </Listbox>
        )}
      </div>

      {selected ? (
        <StudioButton
          onClick={() => {
            removeAsset(selected);
            releaseMedia(selected);
            setSelected(null);
          }}
        >
          Remove selected asset
        </StudioButton>
      ) : null}

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-studio-muted">
          Templates
        </h3>
        <StatusNote>
          Breaking News, Live Coverage, Election Results, Weather Alert and Interview templates are planned for a later milestone.
        </StatusNote>
      </div>
      {error ? <StatusNote tone="error">{error}</StatusNote> : null}
    </div>
  );
}
