---
name: daily-discord-report
description: Compile and post a daily end-of-day report to a Discord channel, especially for scheduled 19:00 JST check-ins. Use when asked to report everything done today, provide a detailed activity log, summarize task progress, include security or health-check findings, and format the result as a clear daily report for Discord.
---

# Daily Discord Report

Produce one clean Discord-ready report that covers the full day without turning into a wall of noise.

## Workflow

1. Define the reporting window.
   - Default to today in JST unless the user specifies another date.
   - If the report is being generated before the end of the day, say it is interim.
2. Gather evidence before writing.
   - Read today's relevant workspace notes first, especially `memory/YYYY-MM-DD.md`.
   - Check project state when relevant: `git status`, recent commits, changed files, task trackers, or notes.
   - If the report mentions security/health, run concrete checks instead of bluffing.
3. Separate facts from inference.
   - Mark uncertain items as estimates or assumptions.
   - If something cannot be verified, say so briefly.
4. Post a single structured message to Discord.
   - Keep it readable in channel format.
   - Prefer bullets and short sections.
   - Do not use markdown tables on Discord.

## Required sections

Always include these sections unless the user explicitly asks for a shorter format:

- **今日のサマリー**
  - 3-6 bullets covering the most important outcomes.
- **詳細ログ**
  - Chronological or grouped bullets describing what was done.
- **タスク進捗**
  - For each active task: `task name — status — next step`.
  - Use clear labels like `完了`, `進行中`, `保留`, `未着手`.
- **セキュリティ / ヘルスチェック**
  - Report only checked items.
  - Examples: OpenClaw status, update state, exposed services, firewall/SSH posture, failed jobs, unusual errors, stale dependencies.
- **明日の優先事項**
  - 2-5 bullets.

## Minimum quality bar

- Do not claim “everything done today” unless the report actually consulted available evidence.
- Prefer named files, commands, timestamps, and outcomes over vague wording.
- If there was little activity, say that plainly instead of padding.
- If security checks were skipped, say `未実施` and why.
- If nothing notable changed, still provide a short but complete report.

## Security/health checks

Choose checks that fit the environment and task. Good defaults:

- `openclaw status`
- Relevant `git status` or recent commits in the workspace
- Recent logs or job status if the report references automations
- Obvious failure states, such as broken scheduled jobs or uncommitted critical changes

If a deeper security audit is requested, use the dedicated `healthcheck` skill.

## Discord formatting rules

- No markdown tables.
- Use section headers plus bullet lists.
- Keep paragraphs short.
- Put links in angle brackets when multiple links are included.

## Use the template

Read `references/report-template.md` when drafting the final post.
