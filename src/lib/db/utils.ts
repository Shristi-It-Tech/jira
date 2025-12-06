import type { Schema } from 'mongoose';

export const baseSchemaOptions = {
  timestamps: true,
  versionKey: false,
} as const;

export const attachTransform = <TSchema extends Schema>(schema: TSchema) => {
  const transform = (_: unknown, ret: Record<string, any>) => {
    ret.$id = ret._id?.toString();
    ret.$createdAt = ret.createdAt instanceof Date ? ret.createdAt.toISOString() : ret.createdAt;
    ret.$updatedAt = ret.updatedAt instanceof Date ? ret.updatedAt.toISOString() : ret.updatedAt;

    delete ret._id;
    delete ret.createdAt;
    delete ret.updatedAt;

    return ret;
  };

  schema.set('toJSON', {
    virtuals: true,
    transform,
  });

  schema.set('toObject', {
    virtuals: true,
    transform,
  });

  return schema;
};
