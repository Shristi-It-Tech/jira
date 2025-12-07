import { parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs';

import { TaskStatus, TaskType } from '@/features/tasks/types';

export const useTaskFilters = () => {
  return useQueryStates({
    projectId: parseAsString,
    status: parseAsStringEnum(Object.values(TaskStatus)),
    assigneeId: parseAsString,
    type: parseAsStringEnum(Object.values(TaskType)),
    search: parseAsString,
  });
};
