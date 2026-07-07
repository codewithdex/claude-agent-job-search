# JobSearch Agent (Python)

基于 EdgeOne Makers 的 AI 求职助手 — 使用 Claude Agent SDK (Python) 实现流式聊天，通过 MCP 桥接沙箱工具，支持简历分析、投递定制、面试准备与进度跟踪。

**Framework：** Claude Agent SDK · **Category：** Career / Productivity · **Language：** Python

## 概述

面向求职者的生产级 Agent 模板，帮助你：

- **审阅和优化简历** — 结构、成果描述、关键词密度
- **定制申请材料** — 针对具体职位描述调整简历和求职信
- **分析岗位匹配度** — 通过沙箱代码执行做 ATS 风格关键词匹配
- **准备面试** — 行为面试问题、STAR 回答辅导、公司调研
- **跟踪投递进度** — 在 workspace 文件中保存简历、求职信和状态
- **调研公司** — 通过浏览器工具抓取招聘页面和公开职位信息

## 环境变量

| 变量 | 必填 | 说明 |
|------|------|------|
| `AI_GATEWAY_API_KEY` | 是 | 模型网关 API Key |
| `AI_GATEWAY_BASE_URL` | 是 | 网关 Base URL，Makers Models 使用 `https://ai-gateway.edgeone.link/v1` |
| `AI_GATEWAY_MODEL` | 否 | 模型 ID，默认 `@makers/deepseek-v4-flash` |
| `WSA_API_KEY` | 否 | 腾讯云 Web Search API Key，用于薪资和市场调研 |

## 本地开发

前置依赖：Node.js ≥ 18、Python ≥ 3.10，以及 EdgeOne CLI（`npm i -g edgeone`）。

```bash
npm install
pip install -r agents/requirements.txt
cp .env.example .env       # 填入 AI_GATEWAY_API_KEY / AI_GATEWAY_BASE_URL
edgeone makers dev
```

本地观测面板：`http://localhost:8080/agent-metrics`。

## 试试这些

界面快捷按钮对应的示例提示：

1. *「帮我审阅软件工程师岗位的简历，并给出具体改进建议。」*
2. *「帮我针对科技创业公司的产品经理岗位定制简历和求职信。」*
3. *「分析我的简历与这份职位描述的匹配度，并列出最需要补强的差距。」*

直接在聊天中粘贴简历或职位描述。Agent 会将优化后的草稿保存到沙箱的 `workspace/` 目录。

## 项目结构

```text
claude-agent-job-search/
├── agents/chat/index.py            # 求职系统提示词 + SSE 流式聊天
├── .claude/skills/job-search/      # 简历分析、定制、面试准备技能
├── workspace/                      # 简历模板和投递跟踪示例
└── src/                            # React 聊天界面
```

## License

MIT.
