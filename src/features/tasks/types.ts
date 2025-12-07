import type { Member } from '@/features/members/types';
import type { Project } from '@/features/projects/types';
import type { Sprint } from '@/features/sprints/types';
import type { WithDocument } from '@/types/database';

export enum TaskStatus {
  BACKLOG = 'BACKLOG',
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE',
}

export enum TaskType {
  EPIC = 'EPIC',
  STORY = 'STORY',
  BUG = 'BUG',
  TASK = 'TASK',
}

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  [TaskType.EPIC]: 'Epic',
  [TaskType.STORY]: 'Story',
  [TaskType.BUG]: 'Bug',
  [TaskType.TASK]: 'Task',
};

export type Task = WithDocument<{
  name: string;
  status: TaskStatus;
  type: TaskType;
  assigneeId: string;
  projectId: string;
  workspaceId: string;
  position: number;
  dueDate: string;
  sprintId: string;
  description?: string;
}>;

export type TaskWithRelations = Task & {
  project: Project;
  assignee: Member;
  sprint?: Sprint;
};

export type TaskAttachment = WithDocument<{
  taskId: string;
  workspaceId: string;
  memberId: string;
  fileId: string;
  name: string;
  size: number;
  mimeType: string;
}>;

export type TaskAttachmentWithAuthor = TaskAttachment & {
  uploader?: Member;
};
