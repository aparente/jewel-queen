#!/usr/bin/env node
/**
 * Antigravity Stop hook: if the last post-commit WCAG 2.2 AA report still has
 * manual accessibility failures (and continuationActive is false, preventing loops),
 * asks the agent to invoke the `wcag22-accessibility-check` skill, fix them, and re-commit.
 */

import fs from 'fs';
import path from 'path';

function readStdin() {
  try {
    return JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
  } catch {
    return {};
  }
}

const payload = readStdin();
const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const reportFile = path.join(repoRoot, '.agents/.a11y-last-report.json');

// Never loop if a Stop hook already triggered continuation this turn
if (!payload.continuationActive && fs.existsSync(reportFile)) {
  try {
    const report = JSON.parse(fs.readFileSync(reportFile, 'utf8'));
    if (report && report.ok === false && Array.isArray(report.findings) && report.findings.length > 0) {
      const summary = report.findings
        .slice(0, 5)
        .map((f) => `[${f.sc}] (${f.file}) ${f.message}`)
        .join('; ');
      process.stdout.write(
        JSON.stringify({
          decision: 'continue',
          reason: `Post-commit WCAG 2.2 AA accessibility check found ${report.findings.length} remaining issue(s): ${summary}. Use the wcag22-accessibility-check skill to fix them and re-commit with [skip-a11y].`
        }) + '\n'
      );
      process.exit(0);
    }
  } catch {
    // Ignore malformed report
  }
}

process.stdout.write(JSON.stringify({ decision: 'allow' }) + '\n');
