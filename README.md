# NewsForge Studio

Starter code for a **hybrid browser-first + cloud news video assembly** platform.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Implemented
- Next.js / React / Tailwind studio layout
- Local video selection and Canvas-based aspect-ratio-preserving preview
- Time-synchronized, dynamic breaking-news ticker
- Local / cloud / auto mode UI (selection only)
- Shared TypeScript render contracts

## Not yet implemented
- Final MP4 export, intro/outro stitching, audio mixing
- Browser WebCodecs / FFmpeg.wasm encoder
- Firebase Auth, Storage, Firestore and Cloud Run job submission
- User accounts, persistence, test suite, CI

The export control is intentionally disabled until the pipeline works. No uploaded video leaves the device in this starter.

## Planned architecture

`Next.js UI → shared render specification → local WebCodecs/FFmpeg.wasm engine OR Firebase Storage → Cloud Run FFmpeg worker → MP4 download`

For cloud setup, use a private Firebase project and service-account credentials managed outside Git. Do not commit secrets.
