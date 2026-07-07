const en = {
  // Header
  "app.title": "JobSearch Agent",
  "app.subtitle": "Your AI career coach — resumes, applications, interviews & tracking",

  // Empty state
  "empty.title": "Land your next role",
  "empty.hint": "Paste your resume or a job description to get started. I'll help you tailor applications, prep for interviews, and stay organized.",
  "empty.features": "Resume Review · Application Tailoring · Interview Prep · Job Tracking",
  "empty.card.resume": "Resume review",
  "empty.card.resumeDesc": "Get actionable feedback on structure, impact, and keywords.",
  "empty.card.tailor": "Tailor applications",
  "empty.card.tailorDesc": "Match your resume and cover letter to a specific job posting.",
  "empty.card.interview": "Interview prep",
  "empty.card.interviewDesc": "Practice questions, STAR answers, and company research.",
  "empty.card.track": "Track progress",
  "empty.card.trackDesc": "Keep applications, deadlines, and follow-ups organized.",

  // Chat input
  "chat.placeholder": "Paste a job description, resume, or describe your target role…",
  "chat.hint": "Career guidance only · Not a substitute for professional career counseling",
  "chat.quickActions": "Quick actions",

  // Preset questions
  "preset.1": "Review my resume for a software engineer role and suggest concrete improvements.",
  "preset.1.short": "📄 Review resume",
  "preset.2": "Help me tailor my resume and cover letter for a product manager job at a tech startup.",
  "preset.2.short": "✏️ Tailor application",
  "preset.4": "What behavioral and technical interview questions should I prepare for a senior backend engineer role?",
  "preset.screenshotEdgeOne": "Research a company's engineering culture from their careers page and summarize key talking points.",
  "preset.skill.jobSearch": "Analyze how well my resume matches this job description and list the top gaps to fix.",
  "preset.skill.jobSearch.short": "🎯 Match analysis",

  // Tool indicators
  "tool.commands": "Workspace",
  "tool.files": "Documents",
  "tool.codeRunner": "Match score",
  "tool.browser": "Research",

  // Career hub panel
  "hub.title": "Career Hub",
  "hub.subtitle": "Everything you need for a smarter job search",
  "hub.capabilities": "What I can help with",
  "hub.workflow": "Suggested workflow",
  "hub.workspace": "Your workspace",
  "hub.workspaceHint": "Drafts and trackers are saved here during your session so you can pick up where you left off.",
  "hub.feature.resume.title": "Resume review",
  "hub.feature.resume.desc": "Structure, impact bullets, and keyword improvements.",
  "hub.feature.tailor.title": "Application tailoring",
  "hub.feature.tailor.desc": "Align resume and cover letter to each job description.",
  "hub.feature.interview.title": "Interview prep",
  "hub.feature.interview.desc": "Behavioral questions, STAR coaching, and company briefs.",
  "hub.feature.track.title": "Application tracking",
  "hub.feature.track.desc": "Status, deadlines, and follow-up reminders.",
  "hub.step.1": "Share your resume and target role or industry.",
  "hub.step.2": "Paste a job description or URL to analyze fit.",
  "hub.step.3": "Get tailored edits, cover letter drafts, and gap analysis.",
  "hub.step.4": "Prep for interviews and track your applications.",

  // Web search activity (in-bubble chip)
  "webSearch.error.wsaMissing": "Web search unavailable — needs a {0} API key",
  "webSearch.error.wsaCta": "Get a key",

  // Skill indicators
  "skill.jobSearch": "Job Search",

  // Debug panel
  "debug.title": "Trace",
  "debug.events": "events",
  "debug.clear": "Clear",
  "debug.empty": "Waiting for SSE events...",
  "debug.emptyHint": "After sending a message, all raw backend data will be displayed here.",

  // Status & errors
  "status.error": "Request failed. Please check if the backend service is running.",
  "status.stopped": "⏹ *Generation stopped*",
  "status.backendError": "Backend abort request failed. The server may still be running.",

  // Language toggle
  "lang.switch": "中文",

  // Sidebar
  "sidebar.label": "Application sessions",
  "sidebar.title": "Applications",
  "sidebar.newChat": "New session",
  "sidebar.loading": "Loading sessions...",
  "sidebar.loadMore": "Load more",
  "sidebar.loadingMore": "Loading...",
  "sidebar.emptyTitle": "No sessions yet",
  "sidebar.emptyHint": "Start a new session to work on a role or application.",
  "sidebar.delete": "Delete session",
  "sidebar.deleteConfirm": "Permanently delete this session? This cannot be undone.",

  // Aria labels
  "aria.send": "Send",
  "aria.clearHistory": "Clear history",
  "aria.stopGeneration": "Stop generation",

  "floatingLink.deploy": "Deploy",
  "floatingLink.github": "GitHub",
} as const;

export default en;
