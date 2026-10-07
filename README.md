# GitHub PR timeline cleanup

Userscript for GitHub.com and GitHub Enterprise pull request pages. Metadata matches `https://github.com/*/pull/*` and `https://github.tld/*/pull/*`; Violentmonkey interprets `.tld` as the supported top-level-domain wildcard.

## Build

```sh
bun install
bun run build
```

Vite writes the distributable userscript to `dist/pr-timeline-cleanup.user.js`. `dist/` is committed so it can be installed directly or attached to a release. Rebuild after changing `src/main.ts` or `vite.config.ts`.

## Install

In Tampermonkey or Violentmonkey, create a new script and import/paste `dist/pr-timeline-cleanup.user.js`. The generated metadata matches GitHub.com and GitHub Enterprise pull request pages.
