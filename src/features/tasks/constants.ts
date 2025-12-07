export const LAST_TASK_VIEW_STORAGE_KEY = 'jira-clone:lastTaskView';
export const LAST_TASK_ORIGIN_STORAGE_KEY = 'jira-clone:lastTaskOrigin';
export const LAST_TASK_SOURCE_STORAGE_KEY = 'jira-clone:lastTaskSource';

export type TaskOriginHistory = { type: 'workspace' } | { type: 'project'; projectId: string };

export const serializeTaskOrigin = (origin: TaskOriginHistory) => {
  return origin.type === 'project' ? `project:${origin.projectId}` : 'workspace';
};

export const parseTaskOrigin = (value: string | null): TaskOriginHistory | null => {
  if (!value) return null;
  if (value === 'workspace') return { type: 'workspace' };
  if (value.startsWith('project:')) {
    const [, projectId] = value.split(':');
    if (projectId) {
      return { type: 'project', projectId };
    }
  }
  return null;
};
