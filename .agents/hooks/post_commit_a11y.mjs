#!/usr/bin/env node
/**
 * Antigravity PostToolUse hook: runs after `run_command` executes a `git commit`.
 * Runs the WCAG 2.2 AA accessibility checker (--fix), auto-commits deterministic
 * fixes cleanly with [skip-a11y], and writes `.agents/.a11y-last-report.json` so
 * the Stop hook can ask the agent to fix any remaining manual issues and re-commit.
 */

import fs from 'fs';
import path from 'path';
import { execFileSync, execSync } from 'child_process';

function readStdin() {
  try {
    return JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
  } catch {
    return {};
  }
}

const payload = readStdin();
const cmd = payload?.toolCall?.args?.CommandLine || '';

// Only trigger on successful `git commit` commands (skip our own [skip-a11y] re-commits)
if (!payload?.error && /\bgit\b[^;\n]*\bcommit\b/.test(cmd) && !/\[skip-a11y\]/.test(cmd)) {
  const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
  const checker = path.join(repoRoot, '.agents/skills/wcag22-accessibility-check/scripts/wcag22_check.mjs');
  const reportFile = path.join(repoRoot, '.agents/.a11y-last-report.json');

  if (fs.existsSync(checker)) {
    try {
      execFileSync('node', [checker, '--fix', '--root', repoRoot], {
        cwd: repoRoot,
        stdio: 'ignore',
        env: { ...process.env, A11Y_POST_COMMIT_RUNNING: '1' }
      });
    } catch {
      // Non-zero means manual issues remain; captured below in JSON report
    }

    // Auto-recommit if --fix modified web files
    try {
      const changed = execSync('git status --porcelain -- index.html styles.css js/', {
        cwd: repoRoot,
        encoding: 'utf8'
      }).trim();
      if (changed) {
        execSync('git add -- index.html styles.css js/', { cwd: repoRoot, stdio: 'ignore' });
        execSync('git commit --no-verify -m "a11y: auto-fix WCAG 2.2 AA accessibility issues [skip-a11y]"', {
          cwd: repoRoot,
          stdio: 'ignore',
          env: { ...process.env, A11Y_POST_COMMIT_RUNNING: '1' }
        });
      }
    } catch {
      // Ignore if git commit is unavailable inside restricted context
    }

    // Write final verification report for Stop gate
    try {
      const jsonOut = execFileSync('node', [checker, '--json', '--root', repoRoot], {
        cwd: repoRoot,
        encoding: 'utf8'
      });
      fs.writeFileSync(reportFile, jsonOut, 'utf8');
    } catch (err) {
      if (err?.stdout) fs.writeFileSync(reportFile, String(err.stdout), 'utf8');
    }
  }
}

// PostToolUse contract requires empty JSON object on stdout
process.stdout.write('{}\n');
