# NewsForge Studio

Browser-first newsroom video editor UI. This branch rebuilds the editor on Vercel's **UI SDK** (pinned beta `0.1.0-beta.10`) with serializable state and clean seams for a backend that will be connected later.

## Run

```bash
npm install
npm run dev
npm run typecheck
npm test
npm run build
```

## Implemented UI
- Resizable broadcast workspace: media/audio/script/brand dock, Program Monitor, Inspector, multi-track timeline.
- Local video import with object-URL registry; Canvas preview with frame-driven ticker, safe-area guides and caption overlay.
- Editable timeline built on `@ui-sdk/core` `createSpans`: create, move, trim, split, delete, lock/mute tracks, zoom, frame timecode, keyboard editing, undo/redo.
- Inspector for clip, ticker, audio levels and ducking, captions and export settings.
- Script segments, caption editing at the playhead and real local SRT download.
- Deterministic `RenderSpec` v1 with fingerprint, shown in an export dialog.
- Accessible primitives from UI SDK behind `src/components/ui/*`; custom timeline primitive in `src/components/workspace/primitives/`.
- Backend seams in `src/services/index.ts` (`configureServices`, `getServices`, `hasRenderer`, `hasStorage`). No client imports backend implementations.

## Not implemented / deliberately disabled
- MP4 encoding, WebCodecs/FFmpeg.wasm, Cloud Run renderer and job queue.
- Real audio mixing/playback, MediaRecorder capture and waveform rendering.
- Firebase auth/storage, persistence to a server, autosave beyond local state.
- OAuth connections, scheduling and publication. Export and Publish controls are visibly disabled until engines/accounts exist.

No uploaded or imported media leaves the browser. No secrets or credentials are stored in source or browser storage.

## Structure

```
src/app/                     App Router entry and global Tailwind/UI SDK layers
src/components/ui/           local wrappers around pinned UI SDK components
src/components/workspace/    workspace, monitor, inspector, timeline, panels
src/components/workspace/primitives/  custom createSpans timeline primitive
src/lib/                     serializable types, pure timeline/ticker/audio/caption/spec logic
src/stores/                  Zustand editor state (undo/redo) and transient UI state
src/services/                backend contracts and configuration seam
src/test/                    Vitest/jsdom setup
```

## Backend wiring later

Implement the interfaces in `src/services/index.ts` and call `configureServices(...)` once at startup. UI and stores never import service implementations directly. The export dialog uses `hasRenderer()` to show accurate status; render jobs stay `idle` until a real renderer exists. Keep all timeline/render data serializable — large binary media belongs in the object-URL registry or a storage adapter, never in Zustand.
