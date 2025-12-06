import { Schema, model, models } from 'mongoose';

import { attachTransform, baseSchemaOptions } from '@/lib/db/utils';
import type { WithDocument } from '@/types/database';

export type ProjectDocument = WithDocument<{
  workspaceId: string;
  name: string;
  imageId?: string;
}>;

const ProjectSchema = attachTransform(
  new Schema(
    {
      name: { type: String, required: true, trim: true },
      workspaceId: { type: String, required: true },
      imageId: { type: String },
    },
    baseSchemaOptions,
  ),
);

ProjectSchema.index({ workspaceId: 1, name: 1 }, { unique: true });

export const ProjectModel = models.Project ?? model('Project', ProjectSchema);
