const zh = {
  // Header
  "app.title": "JobSearch Agent",
  "app.subtitle": "运行在 EdgeOne Makers 上的 AI 求职助手 — 简历优化、投递定制、面试准备与进度跟踪",

  // Empty state
  "empty.title": "JobSearch Agent",
  "empty.hint": "我是你的 AI 求职助手，可以帮你审阅简历、针对职位描述定制申请材料、撰写求职信、准备面试、调研公司，并跟踪投递进度。",
  "empty.features": "简历优化 · 投递定制 · 面试准备 · 进度跟踪",

  // Chat input
  "chat.placeholder": "粘贴职位描述、请求简历帮助，或描述你的目标岗位…  ⏎ 发送 · Shift+⏎ 换行",
  "chat.hint": "由 Claude Agent SDK + EdgeOne Makers 驱动 · 仅供职业指导参考",

  // Preset questions
  "preset.1": "帮我审阅软件工程师岗位的简历，并给出具体改进建议。",
  "preset.2": "帮我针对科技创业公司的产品经理岗位定制简历和求职信。",
  "preset.4": "高级后端工程师岗位应该准备哪些行为面试和技术面试问题？",
  "preset.screenshotEdgeOne": "调研某公司的招聘页面，总结其工程文化要点和面试谈资。",
  "preset.skill.jobSearch": "分析我的简历与这份职位描述的匹配度，并列出最需要补强的差距。",

  // Tool indicators
  "tool.commands": "终端命令",
  "tool.files": "文件操作",
  "tool.codeRunner": "代码解释器",
  "tool.browser": "浏览器",

  // Web search activity (in-bubble chip)
  "webSearch.error.wsaMissing": "搜索不可用，需配置 {0} API Key",
  "webSearch.error.wsaCta": "获取 Key",

  // Skill indicators
  "skill.jobSearch": "求职助手",

  // Debug panel
  "debug.title": "传输流",
  "debug.events": "事件",
  "debug.clear": "清除",
  "debug.empty": "等待 SSE 事件...",
  "debug.emptyHint": "发送消息后，所有原始后端数据将在此处显示。",

  // Status & errors
  "status.error": "⚠️ 请求失败，请检查后端服务是否启动。",
  "status.stopped": "⏹ *已停止生成*",
  "status.backendError": "⚠️ 后端中断请求失败，服务端可能仍在运行。",

  // Language toggle
  "lang.switch": "English",

  // Sidebar
  "sidebar.label": "会话列表",
  "sidebar.title": "会话",
  "sidebar.newChat": "新建聊天",
  "sidebar.loading": "正在加载会话...",
  "sidebar.loadMore": "加载更多",
  "sidebar.loadingMore": "加载中...",
  "sidebar.emptyTitle": "暂无会话",
  "sidebar.emptyHint": "点击「新建聊天」开始你的第一次求职对话。",
  "sidebar.delete": "删除会话",
  "sidebar.deleteConfirm": "确定要永久删除这个会话吗？此操作不可恢复。",

  // Aria labels (button hover/screen-reader)
  "aria.send": "发送",
  "aria.clearHistory": "清除历史",
  "aria.stopGeneration": "停止生成",

  // ─── Floating bottom-right action badges ─────────────────────────────
  "floatingLink.deploy": "一键部署",
  "floatingLink.github": "GitHub",
} as const;

export default zh;
