# NewsForge Studio — consolidated project context

Updated: 2026-10-25. This is a distilled handoff of the product and engineering conversation, not a verbatim transcript. Git history and actual repository files take precedence over any historical implementation claim.

## Product goal
NewsForge Studio (also called News Video Studio) is a newsroom-oriented video editor and publishing tool for journalists, news channels and small editorial teams. Primary workflow:
1. Upload raw news footage.
2. Enter one or more news headlines; add animated scrolling ticker and lower thirds.
3. Apply reusable channel brand kit: logo, colors, fonts, watermark, intro/outro.
4. Add/record voice-over, optionally original clip audio and background music; mix and synchronize.
5. Edit timeline and captions; optionally create narration from script.
6. Preview and export final MP4 (initial baseline 1080p, 30fps, H.264/AAC).
7. Download or publish/schedule platform-specific outputs to YouTube, Shorts and Instagram.

Prioritize quick broadcast workflows over general-purpose NLE complexity. UI inspiration: broadcast newsroom, Premiere Pro timeline control, CapCut approachability.

## Stack and repository
- Repo: https://github.com/DRISHTANT-DUBEY/news-video-studio
- Next.js 15, React 19, TypeScript, Tailwind CSS 4; Zustand listed in dependencies.
- Deployment target: Vercel for Next.js UI and authenticated routes.
- Hybrid render architecture: browser engine on capable devices; Cloud Run + native FFmpeg for larger jobs.
- Backend target: Firebase Authentication, Firestore, Firebase Storage, Cloud Tasks, private Google Cloud Run worker.
- Current starter originally contained `src/components/Studio.tsx`, `src/lib/ticker.ts`, `src/lib/render-spec.ts`, `src/app/page.tsx`, and placeholder `services/cloud-renderer/Dockerfile`.
- M1 draft PR: https://github.com/DRISHTANT-DUBEY/news-video-studio/pull/1 (feature/broadcast-workspace).

## Verified versus planned
Verified in earlier work: basic local video import, Canvas preview with scrolling ticker, render mode selector and disabled MP4 export; M1 workspace components were committed to feature branch and a draft PR was opened. A Vercel email reported failed preview deployment at early M1 commit `3c983fc`, `npm run build` exit 1; root compiler error not visible. A later feature-branch head `b0070ed` was reported, but build success is not confirmed. Vercel connector access to the user's team previously returned 403.

Do NOT treat any of these as completed without checking current repo: MP4 encoding, timeline drag/trim/split, audio recording/mixing, AI narration, Firebase backend, Cloud Run renderer, OAuth, social publishing or production deployment. Social publishing draft UI/files were previously attempted; inspect actual branch tree to establish which files are present.

## UI direction
Three main regions plus timeline:
- Left navigation/media panel: assets, templates, audio, captions, brand kit.
- Center persistent Program Monitor: video preview, transport controls, timecode, safe-area guides.
- Right Inspector: contextual ticker, clip, audio, caption, export properties.
- Bottom multi-track timeline: footage, ticker, captions, voice-over, music, intro/outro.
- Top toolbar: project name, undo/redo, autosave, export, Publish & Schedule.

M1: WorkspaceShell, SidebarNavigation, MediaLibrary, ProgramMonitor, InspectorPanel, WorkspaceToolbar; preserve existing ticker.
M2: TimelineEditor, TimelineTrack, TimelineClip, TimelineRuler, Playhead, ClipInspector.
M3: VoiceoverPanel, AudioRecorder, AudioWaveform, AudioMixer, VolumeFader, AudioEffectsPanel.
M4: ScriptEditor, ScriptSegment, CaptionEditor, CaptionOverlay, TranscriptPanel, NarrationGenerator.
M5: ExportDialog, RenderSettings, RenderProgress, RenderJobList, ExportPreview, DownloadResult.

## Voice-over requirements
Upload MP3/WAV/M4A, record with microphone via MediaRecorder, trim/offset/move narration clips, preview waveforms, adjust narration/footage/music levels, mute/solo, fade and automatic music ducking. Use Web Audio for preview and mixing; Cloud FFmpeg audio filters for output. AI text-to-speech is optional and requires a secure server-side provider adapter and cost controls.

## Script and captions
News script segmented by story; editable timed caption track, SRT export, visual caption styling and vertical safe areas. Optional speech transcription and TTS; obtain consent and label generated voices where required.

## Social Publishing Hub
Destinations: YouTube standard (16:9), YouTube Shorts (9:16) and Instagram Reels (9:16).
Sample plan from discussion:
- Caption: `Breaking News | Latest updates from our newsroom`
- Local scheduled time: 2026-10-24 18:00 Asia/Kolkata
- UTC equivalent: 2026-10-24T12:30:00Z
- YouTube visibility selection: public
This is a HISTORICAL EXAMPLE and is now in the past. Never submit it as a live schedule; require a fresh future date and explicit user approval.

Publishing must be optional, separately confirmed, and only via eligible accounts with required permissions. Standard YouTube and Shorts use the same Google OAuth connection but distinct upload jobs. Shorts classification depends on platform rules; not a separate Shorts endpoint. Instagram Reel publishing uses Meta/Instagram authorization and media-container flow, with account eligibility checks. Do not assume personal Instagram accounts are eligible. Manual MP4 download must always remain possible.

## MVP boundary
Single news clip, ticker, channel branding, voice-over upload/record/mix, captions, reliable MP4 export, and eventually 16:9/9:16 variants. Keep batch processing, team approvals, advanced AI and analytics for later.

## Explicit non-goals right now
Do not silently post to social accounts, spend money on cloud renders or AI generation, create production resources, or pretend cloud/OAuth services are connected.

## First debugging task
Inspect latest Vercel deployment for M1 and run `npm run build` on the feature branch. The email screenshot alone cannot identify the actual compiler error. Confirm whether failure was only caused by an intermediate commit before fixing unrelated code.
