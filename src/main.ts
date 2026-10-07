const MIN_GROUP_SIZE = 3;
const STYLE_ID = 'pr-timeline-commit-groups-style';
const GROUP_CLASS = 'pr-timeline-commit-group';
const GROUPED_ROW_CLASS = 'pr-timeline-commit-group-row';

function ensureStyles(): void {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .${GROUP_CLASS} { margin: .25rem 0 .5rem 0; }
    .${GROUP_CLASS} > summary {
      width: fit-content;
      padding: .25rem .5rem;
      color: var(--fgColor-muted, var(--color-fg-muted));
      cursor: pointer;
      border: 1px solid var(--borderColor-default, var(--color-border-default));
      border-radius: 6px;
      font-size: 12px;
      list-style-position: inside;
    }
    .${GROUP_CLASS}[open] > summary { margin-bottom: .25rem; }
  `;
  document.head.append(style);
}

function collapseRuns(): number {
  const timeline = document.querySelector('.js-discussion');
  if (!timeline) return 0;
  ensureStyles();

  // Each push header and its commit rows share the enclosing timeline activity's
  // inner wrapper. Keep all grouped rows inside that existing activity.
  const pushes = timeline.querySelectorAll<HTMLElement>(
    '.js-timeline-item [id^="commits-pushed-"]',
  );
  let groupCount = 0;

  for (const push of pushes) {
    const container = push.parentElement?.parentElement;
    if (!container) continue;

    const rows = container.querySelectorAll<HTMLElement>(
      '.TimelineItem:has(.octicon-git-commit)',
    );
    let run: HTMLElement[] = [];
    const runs: HTMLElement[][] = [];

    for (const row of rows) {
      if (row.classList.contains(GROUPED_ROW_CLASS)) {
        if (run.length >= MIN_GROUP_SIZE) runs.push(run);
        run = [];
      } else {
        run.push(row);
      }
    }
    if (run.length >= MIN_GROUP_SIZE) runs.push(run);

    for (const entries of runs) {
      const firstTitle = entries[0].querySelector('a.markdown-title')?.textContent?.trim() || 'commit';
      const lastTitle = entries[entries.length - 1].querySelector('a.markdown-title')?.textContent?.trim() || 'commit';
      const details = document.createElement('details');
      details.className = GROUP_CLASS;
      const summary = document.createElement('summary');
      summary.textContent = `${entries.length} commits · ${firstTitle} … ${lastTitle}`;
      details.append(summary);
      entries[0].before(details);

      for (const row of entries) {
        row.classList.add(GROUPED_ROW_CLASS);
        details.append(row);
      }
      groupCount++;
    }
  }

  return groupCount;
}

function processTimeline(): void {
  try {
    const count = collapseRuns();
    console.info(`[PR timeline cleanup] Loaded; found ${count} commit groups.`);
  } catch (error) {
    console.error('[PR timeline cleanup] Failed to process timeline:', error);
  }
}

let scheduled = false;
function schedule(): void {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    processTimeline();
  });
}

schedule();
new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
document.addEventListener('turbo:load', schedule);
document.addEventListener('pjax:end', schedule);
