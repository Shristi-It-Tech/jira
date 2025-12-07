import { Schema, model, models } from 'mongoose';

import { BACKLOG_SPRINT_ID } from '@/features/sprints/constants';
import { TaskStatus, TaskType } from '@/features/tasks/types';
import { attachTransform, baseSchemaOptions } from '@/lib/db/utils';
import type { WithDocument } from '@/types/database';

export type TaskDocument = WithDocument<{
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

const TaskSchema = attachTransform(
  new Schema(
    {
      name: { type: String, required: true },
      status: { type: String, enum: Object.values(TaskStatus), default: TaskStatus.BACKLOG },
      type: { type: String, enum: Object.values(TaskType), default: TaskType.TASK },
      assigneeId: { type: String, required: true },
      projectId: { type: String, required: true },
      workspaceId: { type: String, required: true },
      position: { type: Number, required: true },
      dueDate: { type: String, required: true },
      sprintId: { type: String, required: true, default: BACKLOG_SPRINT_ID },
      description: { type: String },
    },
    baseSchemaOptions,
  ),
);

TaskSchema.index({ workspaceId: 1, status: 1, position: 1 });

export const TaskModel = models.Task ?? model('Task', TaskSchema);
