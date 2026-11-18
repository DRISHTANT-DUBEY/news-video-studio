"use client";

import { Switch, SwitchThumb } from "@ui-sdk/react/switch";
import { SliderField } from "@/components/ui/controls";
import { FieldRow } from "@/components/ui/field";
import { StatusNote } from "@/components/ui/panel";
import { dbToGain, gainToDb } from "@/lib/audio";
import { useEditorStore } from "@/stores/editor-store";

export function AudioPanel() {
  const audio = useEditorStore((state) => state.audio);
  const setAudio = useEditorStore((state) => state.setAudio);
  const commitHistory = useEditorStore((state) => state.commitHistory);
  const clips = useEditorStore((state) => state.clips);
  const voiceoverClips = clips.filter((clip) => clip.track === "track-voiceover");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <button type="button" className="studio-button-secondary" disabled>
          Record voice-over — planned
        </button>
        <StatusNote>Voice-over capture, waveforms and audio playback are wired in a later milestone.</StatusNote>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-studio-muted">Mixer</h3>
        <SliderField
          label="Footage"
          value={audio.sourceGain}
          min={0}
          max={2}
          step={0.01}
          format={(value) => `${Math.round(value * 100)}%`}
          onValueChange={(value) => setAudio({ sourceGain: value })}
          onValueCommit={commitHistory}
        />
        <SliderField
          label="Voice-over"
          value={audio.voiceoverGain}
          min={0}
          max={2}
          step={0.01}
          format={(value) => `${Math.round(value * 100)}%`}
          onValueChange={(value) => setAudio({ voiceoverGain: value })}
          onValueCommit={commitHistory}
        />
        <SliderField
          label="Music"
          value={audio.musicGain}
          min={0}
          max={1}
          step={0.01}
          format={(value) => `${Math.round(value * 100)}%`}
          onValueChange={(value) => setAudio({ musicGain: value })}
          onValueCommit={commitHistory}
        />
        <SliderField
          label="Ducking reduction"
          value={Math.abs(audio.duckingReductionDb)}
          min={0}
          max={24}
          step={1}
          format={(value) => `${Math.round(value)} dB`}
          onValueChange={(value) => setAudio({ duckingReductionDb: value })}
          onValueCommit={commitHistory}
        />
        <FieldRow label="Automatic ducking">
          <Switch
            checked={audio.duckingEnabled}
            onCheckedChange={(checked) => {
              setAudio({ duckingEnabled: checked === true });
              commitHistory();
            }}
          >
            <SwitchThumb />
          </Switch>
        </FieldRow>
        <StatusNote>
          Ducking uses {gainToDb(dbToGain(-Math.abs(audio.duckingReductionDb))).toFixed(1)} dB when voice-over is active. Preview mixing is not wired yet.
        </StatusNote>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-studio-muted">Narration segments</h3>
        {voiceoverClips.length === 0 ? (
          <StatusNote>No voice-over clips on the timeline.</StatusNote>
        ) : (
          <ul className="flex flex-col gap-1 text-xs">
            {voiceoverClips.map((clip) => (
              <li key={clip.id} className="rounded-md bg-studio-panel-alt px-3 py-2">
                {clip.label} · {clip.start}–{clip.end}f
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
