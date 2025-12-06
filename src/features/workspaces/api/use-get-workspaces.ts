import { useQuery } from '@tanstack/react-query';

import type { Workspace } from '@/features/workspaces/types';
import { client } from '@/lib/hono';
import type { DocumentList } from '@/types/database';

type WorkspacesResponse = DocumentList<Workspace>;

export const useGetWorkspaces = () => {
  const query = useQuery<WorkspacesResponse>({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const response = await client.api.workspaces.$get();

      if (!response.ok) throw new Error('Failed to fetch workspaces.');

      const { data } = await response.json();

      return data as WorkspacesResponse;
    },
  });

  return query;
};
