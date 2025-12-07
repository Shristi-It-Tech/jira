import { useQuery } from '@tanstack/react-query';

import type { Sprint } from '@/features/sprints/types';
import { client } from '@/lib/hono';
import type { DocumentList } from '@/types/database';

interface UseGetSprintsProps {
  workspaceId: string;
}

type SprintsResponse = DocumentList<Sprint>;

export const useGetSprints = ({ workspaceId }: UseGetSprintsProps) => {
  return useQuery<SprintsResponse>({
    queryKey: ['sprints', workspaceId],
    queryFn: async () => {
      const response = await client.api.sprints.$get({
        query: { workspaceId },
      });

      if (!response.ok) {
        throw new Error('Failed to load sprints.');
      }

      const { data } = await response.json();
      return data as SprintsResponse;
    },
  });
};
