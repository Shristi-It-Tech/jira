import { Schema, model, models } from 'mongoose';

import { EmploymentStatus, EmploymentType } from '@/features/employees/types';
import { attachTransform, baseSchemaOptions } from '@/lib/db/utils';
import type { WithDocument } from '@/types/database';

export type EmployeeDocument = WithDocument<{
  workspaceId: string;
  name: string;
  email: string;
  department?: string;
  jobTitle?: string;
  startDate: string;
  managerId?: string;
  location?: string;
  employmentStatus: EmploymentStatus;
  employmentType: EmploymentType;
}>;

const EmployeeSchema = attachTransform(
  new Schema(
    {
      workspaceId: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      department: { type: String },
      jobTitle: { type: String },
      startDate: { type: String, required: true },
      managerId: { type: String },
      location: { type: String },
      employmentStatus: {
        type: String,
        enum: Object.values(EmploymentStatus),
        default: EmploymentStatus.ACTIVE,
      },
      employmentType: {
        type: String,
        enum: Object.values(EmploymentType),
        default: EmploymentType.FULL_TIME,
      },
    },
    baseSchemaOptions,
  ),
);

EmployeeSchema.index({ workspaceId: 1 });

export const EmployeeModel = models.Employee ?? model('Employee', EmployeeSchema);
