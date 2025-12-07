import { Schema, model, models } from 'mongoose';

import { attachTransform, baseSchemaOptions } from '@/lib/db/utils';
import type { WithDocument } from '@/types/database';

export type TaskAttachmentDocument = WithDocument<{
  taskId: string;
  workspaceId: string;
  memberId: string;
  fileId: string;
  name: string;
  size: number;
  mimeType: string;
}>;

const TaskAttachmentSchema = attachTransform(
  new Schema(
    {
      taskId: { type: String, required: true },
      workspaceId: { type: String, required: true },
      memberId: { type: String, required: true },
      fileId: { type: String, required: true },
      name: { type: String, required: true },
      size: { type: Number, required: true },
      mimeType: { type: String, required: true },
    },
    baseSchemaOptions,
  ),
);

TaskAttachmentSchema.index({ taskId: 1, createdAt: -1 });

export const TaskAttachmentModel = models.TaskAttachment ?? model('TaskAttachment', TaskAttachmentSchema);
