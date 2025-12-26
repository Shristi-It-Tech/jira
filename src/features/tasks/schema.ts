import { z } from 'zod';

import { BACKLOG_SPRINT_ID } from '@/features/sprints/constants';

import { TaskStatus, TaskType } from './types';

export const createTaskSchema = z.object({
  name: z.string().trim().min(1, 'Task name is required.'),
  status: z.nativeEnum(TaskStatus, {
    required_error: 'Task status is required.',
  }),
  workspaceId: z.string().trim().min(1, 'Workspace id is required.'),
  projectId: z.string().trim().min(1, 'Project id is required.'),
  dueDate: z.coerce.date(),
  assigneeId: z.string().trim().min(1, 'Assignee id is required.'),
  createdById: z.string().trim().min(1, 'Created by is required.'),
  description: z.string().optional(),
  type: z.nativeEnum(TaskType, {
    required_error: 'Task type is required.',
  }),
  sprintId: z.string({ required_error: 'Sprint is required.' }).trim().min(1, 'Sprint is required.').default(BACKLOG_SPRINT_ID),
});

export const createTaskAttachmentSchema = z.object({
  file: z.instanceof(File, { message: 'Attachment file is required.' }).refine((file) => file.size > 0, 'Attachment file is required.'),
});
