import { Schema, model, models } from 'mongoose';

import { attachTransform, baseSchemaOptions } from '@/lib/db/utils';
import type { WithDocument } from '@/types/database';

export type CommentDocument = WithDocument<{
  workspaceId: string;
  taskId: string;
  memberId: string;
  body: string;
  parentId?: string;
  mentions: string[];
}>;

const CommentSchema = attachTransform(
  new Schema(
    {
      workspaceId: { type: String, required: true },
      taskId: { type: String, required: true },
      memberId: { type: String, required: true },
      body: { type: String, required: true },
      parentId: { type: String },
      mentions: { type: [String], default: [] },
    },
    baseSchemaOptions,
  ),
);

CommentSchema.index({ taskId: 1 });

export const CommentModel = models.Comment ?? model('Comment', CommentSchema);
