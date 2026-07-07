---
name: job-search
description: Use this skill when the user asks for help with job search tasks such as resume review, resume tailoring, cover letter writing, job description analysis, ATS keyword matching, interview preparation, company research, salary research, or tracking job applications.
---

# Job Search

## Purpose

Help users find and land jobs through structured resume work, application tailoring, interview prep, and organized tracking — using sandbox tools when deterministic analysis is needed.

## When to Use

Use this skill for requests involving:

- Resume or CV review and improvement suggestions.
- Tailoring a resume or cover letter to a specific job description.
- Extracting requirements, skills, and keywords from a job posting.
- ATS-style keyword matching between a resume and job description.
- Interview question prep, STAR-format answer coaching, or mock interviews.
- Company or role research before applying or interviewing.
- Creating or updating a job application tracker.
- Salary range research or offer comparison guidance.

## Workflow

1. Clarify the target role, seniority, industry, and location if missing.
2. For resume/JD analysis, prefer reusable helpers in `scripts/resume_tools.py`.
3. Save artifacts under workspace paths:
   - `workspace/resume/` — resume drafts and versions
   - `workspace/applications/` — cover letters and tailored materials
   - `workspace/research/` — company notes and interview prep
   - `workspace/tracker.json` — application status tracker (create if needed)
4. Use `code_interpreter` for keyword extraction, match scoring, and structured comparisons.
5. Use `browser` to fetch public job postings or company career pages when the user provides a URL.
6. Use `files` to read user-uploaded content and write polished outputs the user can reuse.
7. Return actionable next steps, not just analysis.

## Tool Usage Rules

- Use `code_interpreter` for keyword matching and structured scoring — do not guess match percentages.
- Use `files` to persist resumes, cover letters, and trackers the user may return to later.
- Use `browser` only for public pages the user asked you to research.
- Do not fabricate job listings, salaries, or company facts.
- Do not invent work experience for the user.
- Keep personal data minimal in saved files; avoid storing SSN, passport numbers, or full home addresses.

## Output Format

For resume/JD fit analysis, return:

````md
## Fit Summary

- Match score: ...
- Strong matches: ...
- Gaps to address: ...

## Recommended Resume Edits

1. ...
2. ...

## Cover Letter Angle

...

## Next Steps

- ...
````

For interview prep, return question lists grouped by theme (behavioral, technical, company-specific) with brief coaching notes.

For shorter requests, keep responses concise and scannable.
