"use client";

import { useMemo } from "react";
import { StudioButton } from "@/components/ui/button";
import { SliderField } from "@/components/ui/controls";
import { StatusNote } from "@/components/ui/panel";
import { seekMedia } from "@/lib/media-registry";
import { clipEnd, formatTimecode } from "@/lib/timeline";
import type { Clip } from "@/lib/types";
import { useEditorStore } from "@/stores/editor-store";
import { useWorkspaceStore } from "@/stores/workspace-store";
import {
  TimelineClipPart,
  TimelineHandlePart,
  TimelineRoot,
  TimelineTrackPart,
} from "./primitives/timeline-parts";

export function TimelineEditor() {
  const state = useEditorStore();
  const zoom = useWorkspaceStore((value) => value.timelineZoom);
  const setZoom = useWorkspaceStore((value) => value.setTimelineZoom);
  const duration = Math.max(clipEnd(state.clips), 900);
  const seconds = Math.ceil(duration / state.project.fps);
  const ticks = useMemo(
    () => Array.from({ length: Math.floor(seconds / 5) + 1 }, (_, index) => index * 5),
    [seconds],
  );

  return (
    <section className="studio-panel">
      <div className="studio-panel-heading flex-wrap">
        <div className="flex items-center gap-3">
          <h2>Timeline</h2>
          <span className="studio-hint">Frame-accurate · {state.project.fps} fps</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StudioButton
            onClick={() => state.splitSelected(state.playheadFrame)}
            disabled={state.selectedClipIds.length === 0}
          >
            Split at playhead
          </StudioButton>
          <div className="w-40">
            <SliderField
              label="Zoom"
              value={zoom}
              min={2}
              max={24}
              step={1}
              format={(value) => `${Math.round(value)}×`}
              onValueChange={setZoom}
            />
          </div>
          <span className="studio-hint">{formatTimecode(state.playheadFrame, state.project.fps)}</span>
        </div>
      </div>

      <div className="overflow-x-auto p-4">
        <TimelineRoot
          clips={state.clips}
          tracks={state.tracks.map((track) => track.id)}
          lockedTracks={state.tracks.filter((track) => track.locked).map((track) => track.id)}
          durationFrames={duration}
          onClipsChange={(clips) => useEditorStore.getState().setClips(clips)}
          aria-label="Multi-track timeline"
          className="relative min-w-[720px] select-none"
        >
          {(primitive: { clips: Clip[] }) => (
            <div className="flex flex-col gap-1" style={{ width: `${Math.max(720, seconds * zoom)}px` }}>
              <div className="flex items-center gap-2">
                <span className="w-28 shrink-0" />
                <div
                  aria-hidden="true"
                  className="relative h-5 flex-1 border-b border-studio-line"
                  onPointerDown={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect();
                    const ratio = (event.clientX - rect.left) / rect.width;
                    seekMedia(Math.round(ratio * duration));
                  }}
                >
                  {ticks.map((second) => (
                    <span
                      key={second}
                      className="absolute top-0 h-3 border-l border-studio-line pl-1 text-[10px] text-studio-muted"
                      style={{ left: `${(second * state.project.fps * 100) / duration}%` }}
                    >
                      {second}s
                    </span>
                  ))}
                </div>
              </div>

              {state.tracks.map((track) => (
                <div key={track.id} className="flex items-center gap-2">
                  <div className="flex w-28 shrink-0 items-center justify-between gap-1 text-xs">
                    <span className="truncate">{track.name}</span>
                    <span className="flex gap-1">
                      <button
                        type="button"
                        aria-label={`${track.muted ? "Unmute" : "Mute"} ${track.name}`}
                        aria-pressed={track.muted}
                        onClick={() => state.toggleTrackMute(track.id)}
                        className="rounded border border-studio-line px-1"
                      >
                        M
                      </button>
                      <button
                        type="button"
                        aria-label={`${track.locked ? "Unlock" : "Lock"} ${track.name}`}
                        aria-pressed={track.locked}
                        onClick={() => state.toggleTrackLock(track.id)}
                        className="rounded border border-studio-line px-1"
                      >
                        L
                      </button>
                    </span>
                  </div>
                  <TimelineTrackPart
                    value={track.id}
                    className="relative h-10 flex-1 touch-none overflow-hidden rounded-md border border-studio-line bg-studio-panel-alt"
                  >
                    {primitive.clips
                      .filter((clip) => clip.track === track.id)
                      .map((clip) => (
                        <TimelineClipPart
                          key={clip.id}
                          value={clip.id}
                          onClick={() => state.setSelectedClips([clip.id])}
                          className={`absolute top-0 h-full touch-none overflow-hidden rounded bg-studio-accent-soft px-2 text-xs leading-10 text-white outline-none data-[dragging]:opacity-80 ${
                            state.selectedClipIds.includes(clip.id)
                              ? "ring-2 ring-white"
                              : ""
                          }`}
                        >
                          <span className="pointer-events-none block truncate">{clip.label}</span>
                          <TimelineHandlePart
                            edge="start"
                            className="absolute inset-y-0 left-0 w-2 cursor-ew-resize bg-white/30"
                          />
                          <TimelineHandlePart
                            edge="end"
                            className="absolute inset-y-0 right-0 w-2 cursor-ew-resize bg-white/30"
                          />
                        </TimelineClipPart>
                      ))}
                  </TimelineTrackPart>
                </div>
              ))}

              <div className="flex items-center gap-2">
                <span className="w-28 shrink-0 text-[10px] text-studio-muted">Playhead</span>
                <div className="relative h-3 flex-1" aria-hidden="true">
                  <span
                    className="absolute top-0 h-3 w-0.5 bg-studio-safe"
                    style={{ left: `${(state.playheadFrame * 100) / duration}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </TimelineRoot>
      </div>

      <div className="border-t border-studio-line px-4 py-2">
        <StatusNote>
          Drag to create clips, drag a clip to move it, or drag its edges to trim. Arrow keys move a focused clip; Shift+Arrow trims; Delete removes it.
        </StatusNote>
      </div>
    </section>
  );
}
