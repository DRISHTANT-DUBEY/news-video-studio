# Architecture decisions and contracts

## ADR-001: One editor, one render spec, two engines
Serialize a versioned, deterministic `RenderSpec` from timeline and project state. Browser and cloud renderers consume the same semantic spec; visual parity is tested with fixtures. Browser: Canvas/OffscreenCanvas composition, WebCodecs encoding and MP4 muxing; FFmpeg.wasm as limited fallback. Cloud: private Cloud Run container with native FFmpeg, storage input/output and queued jobs.

## ADR-002: Timeline is data, not UI state
Use serializable project, asset, track, clip, caption, keyframe and audio-envelope entities. Video edits should use integer frame coordinates or rigorously converted timestamps; audio processing uses sample-accurate times. Support intro/main/outro, scrolling ticker, multiple narration segments and captions.

Illustrative types (refine during M2):
```ts
type TrackKind = 'video' | 'ticker' | 'voiceover' | 'music' | 'caption';
type TimelineClip = { id:string; trackId:string; assetId?:string; startFrame:number; durationFrames:number; sourceInFrame:number; gain?:number; text?:string };
type TimelineTrack = { id:string; kind:TrackKind; name:string; locked:boolean; muted:boolean; clips:TimelineClip[] };
type Project = { id:string; title:string; fps:30; width:number; height:number; tracks:TimelineTrack[] };
```

## ADR-003: Audio is a first-class track
Web Audio preview for voice, source and music with gain, fades, offsets and ducking. Cloud renderer should reproduce these controls using FFmpeg. Final MP4 includes AAC audio; verify sync.

## ADR-004: Render variants are editorial, not naive crops
Standard YouTube: 1920x1080 16:9. Shorts and Instagram Reels: 1080x1920 9:16. Share vertical master when eligible, but preserve per-platform adjustments, subject reframing, ticker safe zones, subtitles and logo position. H.264/AAC MP4 baseline.

## ADR-005: Secure publishing pipeline
Firebase Auth for application identity; OAuth Authorization Code + PKCE/state for connected Google and Meta accounts. Store encrypted server-side credentials (KMS/Secret Manager), never browser storage. Firestore campaign + per-destination job states; Cloud Tasks to private Cloud Run publisher with OIDC. Idempotency keys, leases, retries, reconciliation and audit logs. User must confirm accounts, caption, variants, visibility and future scheduled time before creating jobs.

Suggested job states: `draft -> awaiting_connection -> awaiting_render -> ready -> scheduled -> uploading -> processing -> published`, with `failed`, `retry_waiting`, `needs_reauth` and `cancelled` as appropriate. A successful upload is not the same as verified public publication.

YouTube: resumable `videos.insert`; native `status.publishAt` requires private upload under supported constraints; public is intended final visibility, not necessarily upload-time status. Shorts use same upload endpoint.
Instagram: supported professional account and required permissions; create media container, poll processing, call `media_publish` near scheduled time; provider-accessible video URL. Verify current API/version rules before coding.

## ADR-006: Secure cloud and failure handling
Firestore/Storage access controlled by user/project ownership; server-side validation; private worker service accounts; Cloud Tasks queue; signed URLs only when required and scoped; no secrets in repo. UI shows honest progress and retryable errors. Users may cancel before publication when platform permits; never claim an already-published post was withdrawn.

## ADR-007: Browser-first and cost control
Local mode minimizes uploads and cost. Auto mode should explain capability decision and ask permission before cloud upload. Check browser codec support, RAM and input duration. No automatic paid AI/cloud action without confirmation.
