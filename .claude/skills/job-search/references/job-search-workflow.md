# Job Search Workflow Reference

## Typical user journeys

### 1. Resume review
- Ask for target role and industry if not provided.
- Review structure, impact bullets, keyword density, and clarity.
- Suggest rewrites with quantified outcomes.

### 2. Tailor to a job description
- Parse required vs preferred skills from the JD.
- Run keyword match scoring via `scripts/resume_tools.py`.
- Propose specific resume edits and a cover letter outline.

### 3. Interview prep
- Generate behavioral, situational, and role-specific questions.
- Coach STAR-format answers using the user's real experience.
- Summarize company research into talking points.

### 4. Application tracking
- Maintain `workspace/tracker.json` with company, role, status, URL, and notes.
- Status values: saved, applied, phone_screen, interview, offer, rejected, withdrawn.

## Workspace layout

```text
workspace/
├── resume/
│   └── master.md
├── applications/
│   └── acme-backend-engineer/
│       ├── cover-letter.md
│       └── tailored-resume.md
├── research/
│   └── acme-company-notes.md
└── tracker.json
```

## Quality bar

- Specific beats generic: cite exact JD phrases when recommending edits.
- Honest gaps: flag missing requirements instead of overstating fit.
- Reusable outputs: save polished drafts the user can copy into applications.
