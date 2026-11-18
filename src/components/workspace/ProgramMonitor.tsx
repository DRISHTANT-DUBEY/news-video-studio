"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import { StudioButton } from "@/components/ui/button";
import { SliderField } from "@/components/ui/controls";
import { Panel, StatusNote } from "@/components/ui/panel";
import { captionsInRange } from "@/lib/captions";
import {
  getMediaUrl,
  registerMedia,
  registerMediaSeeker,
  releaseMedia,
} from "@/lib/media-registry";
import { clipEnd, secondsToFrames, formatTimecode } from "@/lib/timeline";
import { drawTicker } from "@/lib/ticker";
import { useEditorStore } from "@/stores/editor-store";

export function ProgramMonitor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const headlineRef = useRef("");
  const playheadRef = useRef(0);
  const timeRef = useRef(0);
  const [fileName, setFileName] = useState("");
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");

  const project = useEditorStore((state) => state.project);
  const headline = useEditorStore((state) => state.headline);
  const clips = useEditorStore((state) => state.clips);
  const captions = useEditorStore((state) => state.captions);
  const playhead = useEditorStore((state) => state.playheadFrame);
  const setPlayhead = useEditorStore((state) => state.setPlayhead);
  const setClips = useEditorStore((state) => state.setClips);
  const replaceAsset = useEditorStore((state) => state.replaceAsset);

  const videoClip = clips.find((clip) => clip.track === "track-video");
  const width = project.aspectRatio === "9:16" ? 720 : 1280;
  const height = project.aspectRatio === "9:16" ? 1280 : 720;
  const durationFrames = Math.max(...clips.map((clip) => clip.end), 900);

  useEffect(() => {
    headlineRef.current = headline;
  }, [headline]);

  useEffect(() => {
    playheadRef.current = playhead;
  }, [playhead]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    let frameId = 0;

    const draw = () => {
      const video = videoRef.current;
      const current = playheadRef.current;
      const tickerTime =
        video && video.readyState >= 2 && !video.paused
          ? video.currentTime
          : current / project.fps;
      timeRef.current = tickerTime;

      context.fillStyle = "#020617";
      context.fillRect(0, 0, width, height);

      if (video && video.readyState >= 2 && video.videoWidth > 0) {
        const scale = Math.min(width / video.videoWidth, height / video.videoHeight);
        const drawWidth = video.videoWidth * scale;
        const drawHeight = video.videoHeight * scale;
        context.drawImage(video, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
      } else {
        context.fillStyle = "#94a3b8";
        context.font = `${Math.round(width / 42)}px Arial`;
        context.textAlign = "center";
        context.fillText("Import footage to preview", width / 2, height / 2);
        context.textAlign = "left";
      }

      context.save();
      context.strokeStyle = "rgba(34,211,238,0.7)";
      context.setLineDash([12, 10]);
      context.lineWidth = 2;
      context.strokeRect(width * 0.05, height * 0.05, width * 0.9, height * 0.9);
      context.restore();

      const visibleCaptions = captionsInRange(captions, current);
      if (visibleCaptions.length > 0) {
        context.fillStyle = "rgba(0,0,0,0.75)";
        context.fillRect(width * 0.1, height - height * 0.19, width * 0.8, height * 0.06);
        context.fillStyle = "#ffffff";
        context.font = `bold ${Math.round(height * 0.028)}px Arial`;
        context.textAlign = "center";
        context.fillText(visibleCaptions[0].text, width / 2, height - height * 0.15);
        context.textAlign = "left";
      }

      drawTicker(context, headlineRef.current, timeRef.current, width, height);
      frameId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frameId);
  }, [captions, height, project.fps, width]);

  const loadFile = useCallback(
    (file?: File) => {
      if (!file) return;
      if (!file.type.startsWith("video/")) {
        setError("Choose a video file.");
        return;
      }
      if (file.size > 1024 ** 3) {
        setError("Preview limit is 1 GB.");
        return;
      }
      const video = videoRef.current;
      if (!video) return;
      video.pause();
      const previousId = videoClip?.assetId;
      const asset = registerMedia(file, "video");
      replaceAsset(previousId ?? "", asset);
      if (previousId) releaseMedia(previousId);
      setClips(
        useEditorStore
          .getState()
          .clips.map((clip) =>
            clip.track === "track-video"
              ? { ...clip, label: file.name, sourceIn: 0 }
              : clip,
          ),
        false,
      );
      video.src = getMediaUrl(asset.id) ?? "";
      video.load();
      setFileName(file.name);
      setPlaying(false);
      setError("");
    },
    [replaceAsset, setClips, videoClip?.assetId],
  );

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      try {
        await video.play();
      } catch {
        setError("Playback was blocked or the codec is unsupported.");
      }
    } else {
      video.pause();
    }
  };

  const seek = (frame: number) => {
    const clips = useEditorStore.getState().clips;
    const clamped = Math.max(0, Math.min(Math.max(900, clipEnd(clips)), Math.round(frame)));
    setPlayhead(clamped);
    const video = videoRef.current;
    if (video) video.currentTime = clamped / project.fps;
  };

  useEffect(() => registerMediaSeeker(seek));

  return (
    <Panel
      title="Program Monitor"
      aside={<span className="studio-hint">{project.aspectRatio} · {formatTimecode(playhead, project.fps)}</span>}
      className="flex min-h-0 flex-col"
    >
      <div className="flex flex-col gap-4">
        <div className="overflow-hidden rounded-lg border border-studio-line bg-black">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="mx-auto block max-h-[52vh] w-full object-contain"
            aria-label="Program monitor with news ticker preview"
          />
        </div>

        <video
          ref={videoRef}
          playsInline
          preload="metadata"
          className="hidden"
          onLoadedMetadata={(event) => {
            const duration = event.currentTarget.duration;
            if (!Number.isFinite(duration)) return;
            const frames = secondsToFrames(duration, project.fps);
            setClips(
              useEditorStore
                .getState()
                .clips.map((clip) =>
                  clip.track === "track-video" ? { ...clip, end: Math.max(clip.start + 1, frames) } : clip,
                ),
            );
            setPlayhead(0);
          }}
          onTimeUpdate={(event) => setPlayhead(secondsToFrames(event.currentTarget.currentTime, project.fps))}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onError={() => setError("The browser could not decode this video.")}
        />

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="video/*,.mov,.m4v"
            className="hidden"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              loadFile(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
          <StudioButton onClick={() => inputRef.current?.click()}>Import video</StudioButton>
          <StudioButton onClick={() => seek(Math.max(0, playhead - 1))} aria-label="Step back one frame">
            −1f
          </StudioButton>
          <StudioButton tone="primary" onClick={togglePlayback} disabled={!videoClip?.assetId}>
            {playing ? "Pause" : "Play"}
          </StudioButton>
          <StudioButton onClick={() => seek(playhead + 1)} aria-label="Step forward one frame">
            +1f
          </StudioButton>
          <div className="min-w-[12rem] flex-1">
            <SliderField
              label="Playhead"
              value={Math.min(playhead, durationFrames)}
              min={0}
              max={durationFrames}
              step={1}
              format={(value) => formatTimecode(value, project.fps)}
              onValueChange={(value) => seek(value)}
            />
          </div>
        </div>

        <StatusNote>{fileName || "No footage selected"}</StatusNote>
        {error ? <StatusNote tone="error">{error}</StatusNote> : null}
      </div>
    </Panel>
  );
}
