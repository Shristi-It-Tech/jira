import { Schema, model, models } from 'mongoose';

import { attachTransform, baseSchemaOptions } from '@/lib/db/utils';
import type { WithDocument } from '@/types/database';

export type Workspace = WithDocument<{
  name: string;
  userId: string;
  imageId?: string;
  inviteCode: string;
}>;

const WorkspaceSchema = attachTransform(
  new Schema(
    {
      name: { type: String, required: true, trim: true },
      userId: { type: String, required: true },
      imageId: { type: String },
      inviteCode: { type: String, required: true },
    },
    baseSchemaOptions,
  ),
);

export const WorkspaceModel = models.Workspace ?? model('Workspace', WorkspaceSchema);
