const en = {
  // Header
  "app.title": "JobSearch Agent",
  "app.subtitle": "AI career coach on EdgeOne Makers — resume review, tailoring, interview prep & job tracking",

  // Empty state
  "empty.title": "JobSearch Agent",
  "empty.hint": "I'm your AI job search assistant. I can review resumes, tailor applications to job descriptions, draft cover letters, prep you for interviews, research companies, and track your applications.",
  "empty.features": "Resume Review · Application Tailoring · Interview Prep · Job Tracking",

  // Chat input
  "chat.placeholder": "Paste a job description, ask for resume help, or describe your target role...  ⏎ Send · Shift+⏎ Newline",
  "chat.hint": "Powered by Claude Agent SDK + EdgeOne Makers · For career guidance only",

  // Preset questions
  "preset.1": "Review my resume for a software engineer role and suggest concrete improvements.",
  "preset.2": "Help me tailor my resume and cover letter for a product manager job at a tech startup.",
  "preset.4": "What behavioral and technical interview questions should I prepare for a senior backend engineer role?",
  "preset.screenshotEdgeOne": "Research a company's engineering culture from their careers page and summarize key talking points.",
  "preset.skill.jobSearch": "Analyze how well my resume matches this job description and list the top gaps to fix.",

  // Tool indicators
  "tool.commands": "Commands",
  "tool.files": "Files",
  "tool.codeRunner": "Code Runner",
  "tool.browser": "Browser",

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
  "sidebar.label": "Conversation list",
  "sidebar.title": "Chats",
  "sidebar.newChat": "New chat",
  "sidebar.loading": "Loading conversations...",
  "sidebar.loadMore": "Load more",
  "sidebar.loadingMore": "Loading...",
  "sidebar.emptyTitle": "No conversations yet",
  "sidebar.emptyHint": "Click \"New chat\" to start your first job search session.",
  "sidebar.delete": "Delete conversation",
  "sidebar.deleteConfirm": "Permanently delete this conversation? This cannot be undone.",

  // Aria labels (button hover/screen-reader)
  "aria.send": "Send",
  "aria.clearHistory": "Clear history",
  "aria.stopGeneration": "Stop generation",

  // ─── Floating bottom-right action badges ─────────────────────────────
  "floatingLink.deploy": "Deploy",
  "floatingLink.github": "GitHub",
} as const;

export default en;
