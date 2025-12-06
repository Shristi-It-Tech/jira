import { useQuery } from '@tanstack/react-query';

import type { Project } from '@/features/projects/types';
import { client } from '@/lib/hono';
import type { DocumentList } from '@/types/database';

type ProjectsResponse = {
  data: DocumentList<Project>;
};

interface useGetProjectsProps {
  workspaceId: string;
}

export const useGetProjects = ({ workspaceId }: useGetProjectsProps) => {
  const query = useQuery<DocumentList<Project>>({
    queryKey: ['projects', workspaceId],
    queryFn: async () => {
      const response = await client.api.projects.$get({
        query: { workspaceId },
      });

      if (!response.ok) throw new Error('Failed to fetch projects.');

      const { data } = (await response.json()) as ProjectsResponse;

      return data;
    },
  });

  return query;
};
