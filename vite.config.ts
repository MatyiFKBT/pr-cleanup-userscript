import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: 'GitHub PR timeline commit groups',
        namespace: 'matyifkbt.pr-timeline-cleanup',
        version: '1.0.0',
        description: 'Collapse consecutive commit rows in pull request timelines.',
        match: [
          'https://github.com/*/pull/*',
          'https://github.*.tld/*/pull/*',
        ],
        'run-at': 'document-idle',
        grant: 'none',
      },
      build: {
        fileName: 'pr-timeline-cleanup.user.js',
      },
    }),
  ],
});
