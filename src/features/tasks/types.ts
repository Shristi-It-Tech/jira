import type { Member } from '@/features/members/types';
import type { Project } from '@/features/projects/types';
import type { WithDocument } from '@/types/database';

export enum TaskStatus {
  BACKLOG = 'BACKLOG',
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE',
}

export type Task = WithDocument<{
  name: string;
  status: TaskStatus;
  assigneeId: string;
  projectId: string;
  workspaceId: string;
  position: number;
  dueDate: string;
  description?: string;
}>;

export type TaskWithRelations = Task & {
  project: Project;
  assignee: Member;
};
