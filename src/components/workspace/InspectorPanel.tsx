"use client";

import { StudioButton } from "@/components/ui/button";
import { SelectField, SliderField } from "@/components/ui/controls";
import { FieldRow, TextAreaField, TextField } from "@/components/ui/field";
import { StatusNote } from "@/components/ui/panel";
import { StudioTabs } from "@/components/ui/toolbar";
import { formatTimecode } from "@/lib/timeline";
import { useEditorStore } from "@/stores/editor-store";
import { useWorkspaceStore } from "@/stores/workspace-store";

export function InspectorPanel() {
  const tab = useWorkspaceStore((state) => state.inspectorTab);
  const setTab = useWorkspaceStore((state) => state.setInspectorTab);
  const setExportOpen = useWorkspaceStore((state) => state.setExportOpen);
  const headline = useEditorStore((state) => state.headline);
  const setHeadline = useEditorStore((state) => state.setHeadline);
  const commitHistory = useEditorStore((state) => state.commitHistory);
  const clips = useEditorStore((state) => state.clips);
  const selectedIds = useEditorStore((state) => state.selectedClipIds);
  const playhead = useEditorStore((state) => state.playheadFrame);
  const fps = useEditorStore((state) => state.project.fps);
  const audio = useEditorStore((state) => state.audio);
  const setAudio = useEditorStore((state) => state.setAudio);
  const splitSelected = useEditorStore((state) => state.splitSelected);
  const removeClip = useEditorStore((state) => state.removeClip);
  const setClipGain = useEditorStore((state) => state.setClipGain);
  const captions = useEditorStore((state) => state.captions);
  const updateCaption = useEditorStore((state) => state.updateCaption);
  const removeCaption = useEditorStore((state) => state.removeCaption);
  const renderMode = useEditorStore((state) => state.renderSettings.mode);
  const setRenderMode = useEditorStore((state) => state.setRenderMode);
  const variant = useEditorStore((state) => state.renderSettings.variant);
  const setVariant = useEditorStore((state) => state.setVariant);

  const selected = clips.find((clip) => clip.id === selectedIds[0]);

  return (
    <StudioTabs
      label="Inspector"
      value={tab}
      onValueChange={(value) => setTab(value as typeof tab)}
      tabs={[
        {
          value: "clip",
          label: "Clip",
          panel: selected ? (
            <div className="flex flex-col gap-4">
              <p className="text-sm font-medium">{selected.label}</p>
              <dl className="grid grid-cols-2 gap-2 text-xs text-studio-muted">
                <dt>Start</dt>
                <dd className="text-right tabular-nums text-studio-ink">{formatTimecode(selected.start, fps)}</dd>
                <dt>End</dt>
                <dd className="text-right tabular-nums text-studio-ink">{formatTimecode(selected.end, fps)}</dd>
                <dt>Track</dt>
                <dd className="text-right text-studio-ink">{selected.track.replace("track-", "")}</dd>
              </dl>
              <SliderField
                label="Clip gain"
                value={selected.gain ?? 1}
                min={0}
                max={2}
                step={0.01}
                format={(value) => `${Math.round(value * 100)}%`}
                onValueChange={(value) => setClipGain(selected.id, value)}
                onValueCommit={commitHistory}
              />
              <div className="flex gap-2">
                <StudioButton onClick={() => splitSelected(playhead)}>Split at playhead</StudioButton>
                <StudioButton onClick={() => removeClip(selected.id)}>Delete clip</StudioButton>
              </div>
            </div>
          ) : (
            <StatusNote>Select a clip on the timeline to edit its properties.</StatusNote>
          ),
        },
        {
          value: "ticker",
          label: "Ticker",
          panel: (
            <div className="flex flex-col gap-4">
              <FieldRow label="Headline text" description="The ticker uses this text in both preview and export.">
                <TextAreaField rows={4} maxLength={500} value={headline} onChange={(event) => setHeadline(event.target.value)} onBlur={commitHistory} />
              </FieldRow>
              <StatusNote>Ticker clips live on the Ticker track. Moving one changes when the headline is visible.</StatusNote>
            </div>
          ),
        },
        {
          value: "audio",
          label: "Audio",
          panel: (
            <div className="flex flex-col gap-4">
              <SliderField label="Footage gain" value={audio.sourceGain} min={0} max={2} step={0.01} format={(v) => `${Math.round(v * 100)}%`} onValueChange={(v) => setAudio({ sourceGain: v })} onValueCommit={commitHistory} />
              <SliderField label="Voice-over gain" value={audio.voiceoverGain} min={0} max={2} step={0.01} format={(v) => `${Math.round(v * 100)}%`} onValueChange={(v) => setAudio({ voiceoverGain: v })} onValueCommit={commitHistory} />
              <SliderField label="Music gain" value={audio.musicGain} min={0} max={1} step={0.01} format={(v) => `${Math.round(v * 100)}%`} onValueChange={(v) => setAudio({ musicGain: v })} onValueCommit={commitHistory} />
              <StatusNote>Audio preview and ducking are wired in the render milestone.</StatusNote>
            </div>
          ),
        },
        {
          value: "caption",
          label: "Captions",
          panel: (
            <div className="flex flex-col gap-3">
              {captions.length === 0 ? (
                <StatusNote>No captions. Add them from the Script panel.</StatusNote>
              ) : (
                captions.map((caption) => (
                  <div key={caption.id} className="rounded-lg border border-studio-line p-2">
                    <TextField
                      value={caption.text}
                      aria-label="Caption text"
                      onChange={(event) => updateCaption(caption.id, { text: event.target.value })}
                      onBlur={commitHistory}
                    />
                    <div className="mt-2 flex justify-end">
                      <StudioButton onClick={() => removeCaption(caption.id)}>Remove</StudioButton>
                    </div>
                  </div>
                ))
              )}
            </div>
          ),
        },
        {
          value: "export",
          label: "Export",
          panel: (
            <div className="flex flex-col gap-4">
              <SelectField
                label="Render mode"
                value={renderMode}
                onValueChange={(value) => setRenderMode(value as typeof renderMode)}
                options={[
                  { value: "auto", label: "Auto (planned)" },
                  { value: "local", label: "Local browser (planned)" },
                  { value: "cloud", label: "Cloud (planned)" },
                ]}
              />
              <SelectField
                label="Output variant"
                value={variant}
                onValueChange={(value) => setVariant(value as typeof variant)}
                options={[
                  { value: "landscape", label: "16:9 landscape" },
                  { value: "vertical", label: "9:16 vertical" },
                ]}
              />
              <StudioButton tone="primary" onClick={() => setExportOpen(true)}>
                Open export center
              </StudioButton>
            </div>
          ),
        },
      ]}
    />
  );
}
