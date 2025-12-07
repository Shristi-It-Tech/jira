import { Schema, model, models } from 'mongoose';

import { SprintStatus } from '@/features/sprints/types';
import { attachTransform, baseSchemaOptions } from '@/lib/db/utils';
import type { WithDocument } from '@/types/database';

export type SprintDocument = WithDocument<{
  workspaceId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: SprintStatus;
}>;

const SprintSchema = attachTransform(
  new Schema(
    {
      workspaceId: { type: String, required: true, index: true },
      name: { type: String, required: true, trim: true },
      startDate: { type: String, required: true },
      endDate: { type: String, required: true },
      status: { type: String, enum: Object.values(SprintStatus), default: SprintStatus.CLOSED },
    },
    baseSchemaOptions,
  ),
);

SprintSchema.index({ workspaceId: 1, name: 1 }, { unique: true });

export const SprintModel = models.Sprint ?? model('Sprint', SprintSchema);
