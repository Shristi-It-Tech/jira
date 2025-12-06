import { z } from 'zod';

import { EmploymentStatus, EmploymentType } from '@/features/employees/types';

export const createEmployeeSchema = z.object({
  workspaceId: z.string().trim().min(1),
  name: z.string().trim().min(1, 'Name is required.'),
  email: z.string().email('Invalid email address.'),
  department: z.string().trim().optional(),
  jobTitle: z.string().trim().optional(),
  startDate: z.coerce.date(),
  managerId: z.string().optional(),
  location: z.string().trim().optional(),
  employmentStatus: z.nativeEnum(EmploymentStatus).default(EmploymentStatus.ACTIVE),
  employmentType: z.nativeEnum(EmploymentType).default(EmploymentType.FULL_TIME),
});

export const updateEmployeeSchema = createEmployeeSchema.partial().extend({
  startDate: z.coerce.date().optional(),
});
