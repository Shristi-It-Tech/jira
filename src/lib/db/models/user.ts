import { Schema, model, models } from 'mongoose';

import { attachTransform, baseSchemaOptions } from '@/lib/db/utils';
import type { WithDocument } from '@/types/database';

export type User = WithDocument<{
  name: string;
  email: string;
  password: string;
}>;

const UserSchema = attachTransform(
  new Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true, lowercase: true, trim: true },
      password: { type: String, required: true },
    },
    baseSchemaOptions,
  ),
);

export const UserModel = models.User ?? model('User', UserSchema);
