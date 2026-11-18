# Codex instructions — NewsForge Studio

Read `docs/CODEX_PROJECT_CONTEXT.md` and `docs/IMPLEMENTATION_ROADMAP.md` before changing code. Read `docs/ARCHITECTURE_DECISIONS.md` before implementing rendering, audio, authentication or social publishing.

## Mission
Build a professional browser-first newsroom video editor. A journalist uploads footage, edits a scrolling news ticker, adds channel branding, intro/outro, narration/music and captions, exports a broadcast-ready MP4, and optionally schedules publication to YouTube, YouTube Shorts and Instagram Reels.

## Working rules
- This repository is the source of truth. Verify files and Git state; never assume a feature from the product plan exists.
- Make incremental, reviewable changes; prefer one milestone per PR. Do not merge, deploy production, connect accounts, schedule posts or publish videos without explicit authorization.
- Preserve the working video import + Canvas ticker preview during refactors.
- Use TypeScript strict typing, Next.js App Router, React client components only when necessary, and Tailwind 4.
- Keep timeline/render data serializable and independent from React; use one shared render specification for local and cloud engines.
- Distinguish implemented, mocked, disabled and planned functionality in UI and docs. Never fake successful exports, job progress, OAuth connections or publication.
- Never put OAuth tokens, service account keys, Firebase admin credentials or AI provider keys in source code, localStorage, browser bundles or logs.
- Before marking work complete, run `npm run typecheck` and `npm run build`, plus relevant tests. If unable, state exactly why.
- Test timeline synchronization, audio gain/ducking, captions and export against deterministic fixtures as these modules are added.
- For third-party publishing, check current API requirements, permissions and account eligibility before implementing; require explicit per-destination confirmation.
- Before using ui-sdk, follow the installed `ui-sdk` skill at `node_modules/@ui-sdk/core/skills/ui-sdk/SKILL.md`, read `node_modules/@ui-sdk/react/docs/llms.txt`, and search `docs/core.md` by heading plus `docs/rendering.md` when building a primitive. UI SDK is pinned to a beta and stays behind `src/components/ui/*` wrappers.
- Backend integrations are wired later. Keep files, network calls and storage adapters behind `src/services/*` interfaces; UI and stores must not import backend clients directly.

## First assignment — resolved
The reported Vercel failures at `3c983fc` and `eeabfd0` were intermediate commits missing imported workspace components. The latest `feature/broadcast-workspace` head `b0070ed` built READY on Vercel, and `main` production builds are READY. Current work rebuilds the M1–M5 UI on pinned UI SDK behind local wrappers in `feature/ui-sdk-workspace`; keep PR #1 draft until verification is complete. Do not merge without a passing build and explicit authorization.

## Useful commands
```bash
npm install
npm run typecheck
npm run build
npm run dev
```

## Existing branches / PR
- Default branch: `main`
- M1 feature branch: `feature/broadcast-workspace`
- Draft PR #1: https://github.com/DRISHTANT-DUBEY/news-video-studio/pull/1
- Social Publishing Hub work may exist on main or in commits; inspect actual tree before modifying it.

## Definition of done
Working UI, accurate status indicators, typecheck/build passing, tested preview, no secrets, accessible controls, concise PR description, and clear remaining work.
