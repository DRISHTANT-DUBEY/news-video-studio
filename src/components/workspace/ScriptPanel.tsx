"use client";

import { useState } from "react";
import { StudioButton } from "@/components/ui/button";
import { FieldRow, TextAreaField, TextField } from "@/components/ui/field";
import { StatusNote } from "@/components/ui/panel";
import { toSrt } from "@/lib/captions";
import { nextId } from "@/lib/ids";
import { useEditorStore } from "@/stores/editor-store";

export function ScriptPanel() {
  const script = useEditorStore((state) => state.script);
  const captions = useEditorStore((state) => state.captions);
  const playhead = useEditorStore((state) => state.playheadFrame);
  const addScriptSegment = useEditorStore((state) => state.addScriptSegment);
  const updateScriptSegment = useEditorStore((state) => state.updateScriptSegment);
  const removeScriptSegment = useEditorStore((state) => state.removeScriptSegment);
  const addCaption = useEditorStore((state) => state.addCaption);
  const updateCaption = useEditorStore((state) => state.updateCaption);
  const removeCaption = useEditorStore((state) => state.removeCaption);
  const commitHistory = useEditorStore((state) => state.commitHistory);
  const [draft, setDraft] = useState("");
  const [message, setMessage] = useState("");

  const downloadSrt = () => {
    const blob = new Blob([toSrt(captions)], { type: "application/x-subrip" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "captions.srt";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-studio-muted">News script</h3>
        <FieldRow label="New story segment">
          <TextAreaField
            value={draft}
            rows={3}
            placeholder="Paste one story or narration segment"
            onChange={(event) => setDraft(event.target.value)}
          />
        </FieldRow>
        <StudioButton
          onClick={() => {
            if (!draft.trim()) return;
            addScriptSegment(draft.trim());
            setDraft("");
          }}
        >
          Add segment
        </StudioButton>
      </div>

      <div className="flex flex-col gap-2">
        {script.length === 0 ? (
          <StatusNote>No script segments yet.</StatusNote>
        ) : (
          script.map((segment) => (
            <div key={segment.id} className="rounded-lg border border-studio-line p-2">
              <TextAreaField
                value={segment.text}
                rows={2}
                aria-label="Script segment"
                onChange={(event) => updateScriptSegment(segment.id, event.target.value)}
                onBlur={commitHistory}
              />
              <div className="mt-2 flex justify-end">
                <StudioButton onClick={() => removeScriptSegment(segment.id)}>Remove</StudioButton>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-studio-muted">Captions</h3>
        <StudioButton
          onClick={() => {
            addCaption({
              id: nextId("caption"),
              start: playhead,
              end: playhead + 90,
              text: script[0]?.text.slice(0, 80) ?? "New caption",
            });
            setMessage("Caption added at the playhead.");
          }}
        >
          Add caption at playhead
        </StudioButton>
        {captions.map((caption) => (
          <div key={caption.id} className="rounded-lg border border-studio-line p-2">
            <TextField
              value={caption.text}
              aria-label="Caption text"
              onChange={(event) => updateCaption(caption.id, { text: event.target.value })}
              onBlur={commitHistory}
            />
            <div className="mt-2 flex items-center justify-between text-xs text-studio-muted">
              <span>{caption.start}–{caption.end}f</span>
              <StudioButton onClick={() => removeCaption(caption.id)}>Remove</StudioButton>
            </div>
          </div>
        ))}
        <StudioButton onClick={downloadSrt} disabled={captions.length === 0}>
          Download SRT
        </StudioButton>
        <StatusNote>{message || "Caption timing follows the timeline in frames."}</StatusNote>
      </div>
    </div>
  );
}
