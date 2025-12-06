import { useQuery } from '@tanstack/react-query';

import type { Employee } from '@/features/employees/types';
import { client } from '@/lib/hono';
import type { DocumentList } from '@/types/database';

interface UseGetEmployeesProps {
  workspaceId: string;
}

type EmployeesResponse = DocumentList<Employee>;

export const useGetEmployees = ({ workspaceId }: UseGetEmployeesProps) => {
  return useQuery<EmployeesResponse>({
    queryKey: ['employees', workspaceId],
    queryFn: async () => {
      const response = await client.api.employees.$get({
        query: {
          workspaceId,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch employees.');

      const { data } = await response.json();
      return data as EmployeesResponse;
    },
    enabled: Boolean(workspaceId),
  });
};
