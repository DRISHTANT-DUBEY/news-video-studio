# Start here — Codex

Repo: https://github.com/DRISHTANT-DUBEY/news-video-studio

1. Read `AGENTS.md`.
2. Read `docs/CODEX_PROJECT_CONTEXT.md`, `docs/ARCHITECTURE_DECISIONS.md`, `docs/IMPLEMENTATION_ROADMAP.md`.
3. Inspect actual `main` and `feature/broadcast-workspace` trees, open PR #1 and Vercel deployment status.
4. Begin with stabilizing M1 and fixing any verified build error. Do not assume the old failure still applies.
5. Run `npm install && npm run typecheck && npm run build`.
6. Make a small PR with tests and clear results. Do not merge, deploy production or publish social content without approval.

Suggested first Codex prompt:

> Read AGENTS.md and the docs/CODEX_* and ARCHITECTURE_DECISIONS.md files. Inspect PR #1 and the latest feature/broadcast-workspace commit. Reproduce the Vercel build failure locally, fix only verified errors, run typecheck/build, and report results. Do not merge or deploy production.
