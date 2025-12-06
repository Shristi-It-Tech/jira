import { Schema, model, models } from 'mongoose';

import { MemberRole } from '@/features/members/types';
import { attachTransform, baseSchemaOptions } from '@/lib/db/utils';
import type { WithDocument } from '@/types/database';

export type MemberDocument = WithDocument<{
  workspaceId: string;
  userId: string;
  employeeId?: string;
  role: MemberRole;
}>;

const MemberSchema = attachTransform(
  new Schema(
    {
      workspaceId: { type: String, required: true },
      userId: { type: String, required: true },
      employeeId: { type: String },
      role: {
        type: String,
        enum: Object.values(MemberRole),
        default: MemberRole.MEMBER,
      },
    },
    baseSchemaOptions,
  ),
);

MemberSchema.index({ workspaceId: 1, userId: 1 }, { unique: true });

export const MemberModel = models.Member ?? model('Member', MemberSchema);
