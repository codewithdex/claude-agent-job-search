const zh = {
  // Header
  "app.title": "JobSearch Agent",
  "app.subtitle": "你的 AI 求职教练 — 简历、投递、面试与进度跟踪",

  // Empty state
  "empty.title": "找到你的下一份工作",
  "empty.hint": "粘贴简历或职位描述即可开始。我可以帮你定制申请材料、准备面试并保持条理清晰。",
  "empty.features": "简历优化 · 投递定制 · 面试准备 · 进度跟踪",
  "empty.card.resume": "简历审阅",
  "empty.card.resumeDesc": "针对结构、成果描述和关键词给出可执行建议。",
  "empty.card.tailor": "定制投递",
  "empty.card.tailorDesc": "让简历和求职信与目标岗位高度匹配。",
  "empty.card.interview": "面试准备",
  "empty.card.interviewDesc": "模拟问题、STAR 回答辅导与公司调研。",
  "empty.card.track": "进度跟踪",
  "empty.card.trackDesc": "管理投递状态、截止日期和跟进提醒。",

  // Chat input
  "chat.placeholder": "粘贴职位描述、简历，或描述你的目标岗位…",
  "chat.hint": "仅供职业指导参考 · 不能替代专业职业咨询",
  "chat.quickActions": "快捷操作",

  // Preset questions
  "preset.1": "帮我审阅软件工程师岗位的简历，并给出具体改进建议。",
  "preset.1.short": "📄 审阅简历",
  "preset.2": "帮我针对科技创业公司的产品经理岗位定制简历和求职信。",
  "preset.2.short": "✏️ 定制投递",
  "preset.4": "高级后端工程师岗位应该准备哪些行为面试和技术面试问题？",
  "preset.screenshotEdgeOne": "调研某公司的招聘页面，总结其工程文化要点和面试谈资。",
  "preset.skill.jobSearch": "分析我的简历与这份职位描述的匹配度，并列出最需要补强的差距。",
  "preset.skill.jobSearch.short": "🎯 匹配分析",

  // Tool indicators
  "tool.commands": "工作区",
  "tool.files": "文档",
  "tool.codeRunner": "匹配评分",
  "tool.browser": "调研",

  // Career hub panel
  "hub.title": "求职中心",
  "hub.subtitle": "更智能求职所需的一切",
  "hub.capabilities": "我能帮你做什么",
  "hub.workflow": "推荐流程",
  "hub.workspace": "工作区",
  "hub.workspaceHint": "草稿和跟踪表会在会话期间保存，方便你随时继续。",
  "hub.feature.resume.title": "简历审阅",
  "hub.feature.resume.desc": "结构、成果描述和关键词优化。",
  "hub.feature.tailor.title": "投递定制",
  "hub.feature.tailor.desc": "针对每个 JD 调整简历和求职信。",
  "hub.feature.interview.title": "面试准备",
  "hub.feature.interview.desc": "行为面试、STAR 辅导与公司简报。",
  "hub.feature.track.title": "投递跟踪",
  "hub.feature.track.desc": "状态、截止日期和跟进提醒。",
  "hub.step.1": "分享你的简历和目标岗位或行业。",
  "hub.step.2": "粘贴职位描述或链接，分析匹配度。",
  "hub.step.3": "获取定制修改、求职信草稿和差距分析。",
  "hub.step.4": "准备面试并跟踪投递进度。",

  // Web search
  "webSearch.error.wsaMissing": "搜索不可用，需配置 {0} API Key",
  "webSearch.error.wsaCta": "获取 Key",

  "skill.jobSearch": "求职助手",

  "debug.title": "传输流",
  "debug.events": "事件",
  "debug.clear": "清除",
  "debug.empty": "等待 SSE 事件...",
  "debug.emptyHint": "发送消息后，所有原始后端数据将在此处显示。",

  "status.error": "⚠️ 请求失败，请检查后端服务是否启动。",
  "status.stopped": "⏹ *已停止生成*",
  "status.backendError": "⚠️ 后端中断请求失败，服务端可能仍在运行。",

  "lang.switch": "English",

  "sidebar.label": "求职会话",
  "sidebar.title": "投递记录",
  "sidebar.newChat": "新建会话",
  "sidebar.loading": "正在加载会话...",
  "sidebar.loadMore": "加载更多",
  "sidebar.loadingMore": "加载中...",
  "sidebar.emptyTitle": "暂无会话",
  "sidebar.emptyHint": "新建会话，开始针对某个岗位或投递的工作。",
  "sidebar.delete": "删除会话",
  "sidebar.deleteConfirm": "确定要永久删除这个会话吗？此操作不可恢复。",

  "aria.send": "发送",
  "aria.clearHistory": "清除历史",
  "aria.stopGeneration": "停止生成",

  "floatingLink.deploy": "一键部署",
  "floatingLink.github": "GitHub",
} as const;

export default zh;
