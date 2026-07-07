# JobSearch Agent (Python)

An AI-powered job search assistant built on EdgeOne Makers — streaming chat backed by the Claude Agent SDK (Python), with sandbox tools for resume analysis, application tailoring, company research, and job tracking.

**Framework:** Claude Agent SDK · **Category:** Career / Productivity · **Language:** Python

## Overview

A production-shaped agent template customized for job seekers. It helps you:

- **Review and improve resumes** — structure, impact bullets, keyword density
- **Tailor applications** — match resumes and cover letters to specific job descriptions
- **Analyze job fit** — ATS-style keyword matching via sandbox code execution
- **Prepare for interviews** — behavioral questions, STAR coaching, company research
- **Track applications** — persist resumes, cover letters, and status in workspace files
- **Research companies** — fetch career pages and public job postings via browser tools

Built on the same EdgeOne Makers stack as the Claude Agent Starter:

- **SSE streaming chat** — token-by-token responses with tool-call visibility
- **Sandbox tools via MCP** — `commands`, `files`, `code_interpreter`, `browser`
- **Sticky conversation memory** — Claude transcript + replayable chat history
- **Dual cancellation** — frontend abort + backend `/stop`

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AI_GATEWAY_API_KEY` | Yes | Model gateway API key. Use your Makers Models API Key, or any OpenAI-compatible provider key. |
| `AI_GATEWAY_BASE_URL` | Yes | Gateway base URL. For Makers Models, use `https://ai-gateway.edgeone.link/v1`. |
| `AI_GATEWAY_MODEL` | No | Model ID. Defaults to `@makers/deepseek-v4-flash` (a free built-in model). |
| `WSA_API_KEY` | No | Tencent Cloud Web Search API key. Recommended for salary and market research. |

### How to get `AI_GATEWAY_API_KEY`

1. Open the [Makers Console](https://edgeone.ai/makers/new?s_url=https://console.tencentcloud.com/edgeone/makers).
2. Sign in and enable Makers.
3. Go to **Makers → Models → API Key** and create a key.
4. Copy it into `AI_GATEWAY_API_KEY`.

## Local Development

Prerequisites: Node.js ≥ 18, Python ≥ 3.10, and the EdgeOne CLI (`npm i -g edgeone`).

```bash
npm install
pip install -r agents/requirements.txt
cp .env.example .env       # then fill in AI_GATEWAY_API_KEY / AI_GATEWAY_BASE_URL
edgeone makers dev
```

Local agent metrics & traces are exposed at `http://localhost:8080/agent-metrics`.

## What to Try

Example prompts (also available as quick-start buttons in the UI):

1. *"Review my resume for a software engineer role and suggest concrete improvements."*
2. *"Help me tailor my resume and cover letter for a product manager job at a tech startup."*
3. *"Analyze how well my resume matches this job description and list the top gaps to fix."*

Paste your resume or job description directly into the chat. The agent saves polished drafts under `workspace/` in the sandbox.

## Project Structure

```text
claude-agent-job-search/
├── agents/
│   ├── chat/index.py               # Job search system prompt + SSE streaming
│   └── stop/index.py               # Abort active agent run
├── cloud-functions/                 # History, conversations, clear/delete
├── .claude/skills/job-search/       # Resume analysis, tailoring, interview prep skill
│   ├── SKILL.md
│   ├── scripts/resume_tools.py     # Keyword matching & ATS-style scoring
│   └── references/job-search-workflow.md
├── workspace/                       # Sample resume template & tracker layout
│   ├── resume/master-template.md
│   └── tracker.json
├── src/                             # React chat UI
└── edgeone.json
```

## Customization

The main job-search customizations live in:

| File | What to edit |
|------|--------------|
| `agents/chat/index.py` | System prompt and agent behavior |
| `.claude/skills/job-search/SKILL.md` | Skill workflow and output format |
| `src/i18n/en.ts` / `zh.ts` | UI copy and preset prompts |

## License

MIT.
