import { useQuery } from '@tanstack/react-query';

import type { TaskStatus, TaskType, TaskWithRelations } from '@/features/tasks/types';
import { client } from '@/lib/hono';
import type { DocumentList } from '@/types/database';

interface useGetTasksProps {
  workspaceId: string;
  projectId?: string | null;
  status?: TaskStatus | null;
  search?: string | null;
  assigneeId?: string | null;
  dueDate?: string | null;
  type?: TaskType | null;
  sprintId?: string | null;
  createdById?: string | null;
}

type TasksResponse = DocumentList<TaskWithRelations>;

export const useGetTasks = ({
  workspaceId,
  projectId,
  status,
  search,
  assigneeId,
  dueDate,
  type,
  sprintId,
  createdById,
}: useGetTasksProps) => {
  const query = useQuery<TasksResponse>({
    queryKey: ['tasks', workspaceId, projectId, status, search, assigneeId, dueDate, type, sprintId, createdById],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
          projectId: projectId ?? undefined,
          status: status ?? undefined,
          search: search ?? undefined,
          assigneeId: assigneeId ?? undefined,
          dueDate: dueDate ?? undefined,
          type: type ?? undefined,
          sprintId: sprintId ?? undefined,
          createdById: createdById ?? undefined,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch tasks.');

      const { data } = await response.json();

      return data as TasksResponse;
    },
  });

  return query;
};
