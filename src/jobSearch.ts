export type JobSearchTask =
  | 'review_resume'
  | 'tailor_application'
  | 'match_analysis'
  | 'interview_prep'
  | 'cover_letter';

export interface JobSearchFormValues {
  targetRole: string;
  targetCompany: string;
  industry: string;
  resume: string;
  jobDescription: string;
  task: JobSearchTask;
}

export interface JobSearchTaskMeta {
  id: JobSearchTask;
  mark: string;
  labelKey: string;
  descKey: string;
}

export const JOB_SEARCH_TASKS: JobSearchTaskMeta[] = [
  { id: 'review_resume', mark: '01', labelKey: 'task.review.label', descKey: 'task.review.desc' },
  { id: 'tailor_application', mark: '02', labelKey: 'task.tailor.label', descKey: 'task.tailor.desc' },
  { id: 'match_analysis', mark: '03', labelKey: 'task.match.label', descKey: 'task.match.desc' },
  { id: 'cover_letter', mark: '04', labelKey: 'task.cover.label', descKey: 'task.cover.desc' },
  { id: 'interview_prep', mark: '05', labelKey: 'task.interview.label', descKey: 'task.interview.desc' },
];

const TASK_INSTRUCTIONS: Record<JobSearchTask, string> = {
  review_resume:
    'Review the resume for the target role. Give concrete, prioritized improvements with example bullet rewrites. Focus on structure, impact, and keywords.',
  tailor_application:
    'Tailor the resume and suggest a cover letter outline for this specific job. Highlight transferable skills and align language to the job description.',
  match_analysis:
    'Analyze resume fit against the job description. Estimate keyword alignment, list strong matches, gaps, and the top edits to improve ATS-style match.',
  cover_letter:
    'Draft a cover letter tailored to this role and company. Preserve an authentic voice; avoid generic boilerplate.',
  interview_prep:
    'Prepare interview questions and coaching notes for this role. Include behavioral, situational, and role-specific questions with brief STAR guidance.',
};

export const INITIAL_FORM: JobSearchFormValues = {
  targetRole: '',
  targetCompany: '',
  industry: '',
  resume: '',
  jobDescription: '',
  task: 'review_resume',
};

export function validateJobSearchForm(values: JobSearchFormValues): string {
  if (!values.targetRole.trim() && !values.resume.trim() && !values.jobDescription.trim()) {
    return 'Enter a target role, paste your resume, or paste a job description.';
  }
  if (values.task === 'review_resume' && !values.resume.trim()) {
    return 'Paste your resume for a review.';
  }
  if (
    (values.task === 'tailor_application' || values.task === 'match_analysis' || values.task === 'cover_letter')
    && !values.jobDescription.trim()
  ) {
    return 'Paste the job description for this task.';
  }
  if (values.task === 'tailor_application' && !values.resume.trim()) {
    return 'Paste your resume so it can be tailored.';
  }
  if (values.task === 'match_analysis' && !values.resume.trim()) {
    return 'Paste your resume for match analysis.';
  }
  return '';
}

export function buildJobSearchPrompt(values: JobSearchFormValues): string {
  const lines = [
    'Job search assistance request. Use the job-search skill and sandbox tools when helpful.',
    `Task: ${TASK_INSTRUCTIONS[values.task]}`,
  ];

  if (values.targetRole.trim()) lines.push(`Target role: ${values.targetRole.trim()}`);
  if (values.targetCompany.trim()) lines.push(`Target company: ${values.targetCompany.trim()}`);
  if (values.industry.trim()) lines.push(`Industry: ${values.industry.trim()}`);

  if (values.resume.trim()) {
    lines.push('', '--- RESUME ---', values.resume.trim());
  }
  if (values.jobDescription.trim()) {
    lines.push('', '--- JOB DESCRIPTION ---', values.jobDescription.trim());
  }

  lines.push(
    '',
    'Return a clear, actionable response with headings. Save useful drafts under workspace/ when appropriate.',
  );

  return lines.join('\n');
}

export const TOOL_PROGRESS: Record<string, string> = {
  files: 'Updating documents',
  file: 'Updating documents',
  code_interpreter: 'Running match analysis',
  browser: 'Researching role & company',
  commands: 'Managing workspace',
  web_search: 'Searching the web',
  job_search: 'Loading job search skill',
};

export function toolProgressLabel(toolName: string): string {
  const short = toolName.split('__').pop()?.toLowerCase() ?? toolName.toLowerCase();
  for (const [key, label] of Object.entries(TOOL_PROGRESS)) {
    if (short.includes(key)) return label;
  }
  return `Using ${short.replace(/_/g, ' ')}`;
}

export function activeTaskMeta(task: JobSearchTask): JobSearchTaskMeta {
  return JOB_SEARCH_TASKS.find(item => item.id === task) ?? JOB_SEARCH_TASKS[0];
}
