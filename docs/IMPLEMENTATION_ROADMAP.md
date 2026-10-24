# Execution roadmap for Codex

This is a milestone checklist, not a claim of completed features. Check repository and open PRs before starting.

## Priority 0: Stabilize existing M1 PR
- [ ] Checkout `feature/broadcast-workspace`; inspect latest branch head and draft PR #1.
- [ ] Run `npm install`, `npm run typecheck`, `npm run build`.
- [ ] Inspect current Vercel preview/build logs if access available. Historical failure at `3c983fc` may have been an intermediate commit with missing imports.
- [ ] Fix reproducible errors; verify import, ticker, play/pause, seeking and /publish route if present.
- [ ] Review accessibility/responsive layout; add basic tests/CI.
- [ ] Update PR with verification results; merge only after explicit authorization.

## M1: Broadcast workspace (4–6 engineering days estimate)
Components: WorkspaceShell, SidebarNavigation, MediaLibrary, ProgramMonitor, InspectorPanel, WorkspaceToolbar.
Acceptance: responsive shell, persistent monitor, ticker intact, navigation, build passing.

## M2: Multi-track timeline (7–10 days estimate)
Components: TimelineEditor, TimelineTrack, TimelineClip, TimelineRuler, Playhead, ClipInspector.
Tasks: versioned timeline schema; trim/split/move; snapping; zoom; keyboard shortcuts; undo/redo; frame-accurate preview; serialization tests.
Acceptance: multiple clips can be edited and previewed with correct timing.

## M3: Voice-over and mixer (6–9 days estimate)
Components: VoiceoverPanel, AudioRecorder, AudioWaveform, AudioMixer, VolumeFader, AudioEffectsPanel.
Tasks: audio upload and microphone permission; waveform; segment timing; per-track gain/mute/fades; ducking; synchronized preview; audio tests.
Acceptance: voice/music/source audio in sync and controllable.

## M4: Script, captions and AI narration (8–12 days estimate)
Components: ScriptEditor, ScriptSegment, CaptionEditor, CaptionOverlay, TranscriptPanel, NarrationGenerator.
Tasks: editable news script, caption segments, SRT export, optional transcription and opt-in TTS adapter; accessible review workflow.
Acceptance: captions follow timeline; narration segments are editable and audibly synchronized.

## M5: Export center (10–15 days estimate)
Components: ExportDialog, RenderSettings, RenderProgress, RenderJobList, ExportPreview, DownloadResult.
Tasks: deterministic RenderSpec; browser WebCodecs/MP4 muxing; FFmpeg.wasm fallback assessment; Cloud Run FFmpeg worker; Firebase storage/job queue; cancellation/retries; 16:9 and 9:16 export; progress.
Acceptance: downloaded MP4 decodes, contains expected ticker/captions/audio and meets sync tests.

## M6: Social Publishing Hub
- [ ] Draft-only UI, platform previews, per-platform metadata and future-date validation.
- [ ] Firebase Auth, Firestore security rules, Storage and credential encryption.
- [ ] Google OAuth + YouTube upload and native scheduling.
- [ ] Vertical Shorts output and YouTube Shorts upload.
- [ ] Meta OAuth and eligible Instagram professional account selection.
- [ ] Instagram Reel media container, processing poll and scheduled publication.
- [ ] Cloud Tasks, private Cloud Run worker, idempotency, audit trail, retry/reconnect, cancellation.
- [ ] Test accounts, platform app review, rate limits, manual download fallback.
Acceptance: explicit approval creates three independent jobs; each destination reports verified outcome. No production posts without permission.

## Development practice
Use small branches and draft PRs, test locally and on Vercel preview, document blocked integrations. Estimates are directional, not commitments. Preserve source clips and do not upload them without consent.
