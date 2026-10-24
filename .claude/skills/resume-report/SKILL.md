---
name: resume-report
description: Use this skill when the user asks for a resume tweak report, resume improvement report, resume review report, or any downloadable/exportable resume analysis. Produces a polished, self-contained Resume Tweaks Report in markdown that the app exports to PDF.
---

# Resume Tweaks Report

## Purpose

Produce a polished, self-contained **Resume Tweaks Report** for a resume (optionally against a job description). The app's UI streams this report and exports it to PDF, so the output must be clean, standalone markdown.

## When to Use

- The user picks the "Tweak report" coaching mode, or asks for a resume report/analysis they can save or share.
- The user asks to "tweak", "fix", or "improve" a resume and wants a written deliverable.

## Workflow

1. Read the resume (and job description, if provided) from the user's message.
2. If a job description is present, run `code_interpreter` with `scripts/resume_tools.py`-style keyword matching (from the job-search skill) to ground the ATS section in real numbers — do not guess match percentages.
3. Write the full report as your response text, following the format below.
4. Persist a copy with the `files` tool at `workspace/reports/<role-slug-or-general>-tweak-report.md` so the user can retrieve it later. Do this AFTER composing the report; the report must still be your visible answer.

## Output Rules (critical — the report is exported to PDF)

- Return **only** the report markdown. No preamble ("Sure, here is…"), no follow-up questions, no commentary about what you did.
- Start with a single `#` H1 title, e.g. `# Resume Tweaks Report — Senior Product Manager`.
- Second line: target role / company (if known) and the date.
- Do not ask clarifying questions in this flow — work with what was provided and note assumptions in one line under the title if needed.
- Never fabricate experience. Rewrite bullets only from facts in the pasted resume; use [brackets] for placeholders the user must fill.
- No images, no base64, no HTML. Tables are allowed and encouraged for the keyword section.
- Keep it to roughly one page of dense, scannable content — this becomes an A4 PDF.

## Report Format

````md
# Resume Tweaks Report — <Target Role or "General Review">

**Target:** <role> @ <company or "—"> · **Date:** <YYYY-MM-DD>

## Fit Summary

- **Overall:** <2–3 sentence verdict>
- **Match score:** <only if a JD was provided, from real keyword analysis — e.g. 68% (19/28 JD keywords present)>
- **Strongest signals:** <top 3 things already working>
- **Biggest gaps:** <top 3 things missing>

## Priority Edits (do these first)

1. **P0 —** <edit with one-line reason>
2. **P0 —** <edit>
3. **P1 —** <edit>

## Bullet Rewrites

| Before (your resume) | After (tweaked) |
|---|---|
| <original bullet> | <rewritten, quantified, action-verb-led> |

## Keyword & ATS Notes

| JD keyword | In resume? | Where to add |
|---|---|---|
| <term> | ✅ / ❌ | <section> |

(If no JD was provided, replace this section with a short list of keywords commonly expected for the target role.)

## Quick Wins

- <formatting / structure / hygiene fixes, 3–5 bullets>

## Next Steps

1. <concrete action>
2. <concrete action>
````

## Tool Usage Rules

- Use `code_interpreter` for keyword extraction and match scoring — never invent percentages.
- Use `files` only to persist the report copy under `workspace/reports/`.
- Do not use `browser` unless the user gave a URL to research.
- Keep personal data minimal in the saved copy.
