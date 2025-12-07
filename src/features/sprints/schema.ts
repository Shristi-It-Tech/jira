import { z } from 'zod';

import { SprintStatus } from '@/features/sprints/types';

const sprintBaseSchema = z.object({
  workspaceId: z.string().trim().min(1, 'Workspace id is required.'),
  name: z.string().trim().min(1, 'Sprint name is required.'),
  startDate: z.coerce.date({
    required_error: 'Sprint start date is required.',
  }),
  endDate: z.coerce.date({
    required_error: 'Sprint end date is required.',
  }),
  status: z.nativeEnum(SprintStatus).optional(),
});

const withDateValidation = <TSchema extends z.ZodTypeAny>(schema: TSchema) =>
  schema.refine((data) => data.endDate >= data.startDate, {
    message: 'End date must be after start date.',
    path: ['endDate'],
  });

export const createSprintSchema = withDateValidation(sprintBaseSchema);
export const updateSprintSchema = withDateValidation(sprintBaseSchema.omit({ workspaceId: true }));
