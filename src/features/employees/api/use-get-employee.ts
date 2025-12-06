import { useQuery } from '@tanstack/react-query';

import type { Employee } from '@/features/employees/types';
import { client } from '@/lib/hono';

interface UseGetEmployeeProps {
  employeeId: string;
}

export const useGetEmployee = ({ employeeId }: UseGetEmployeeProps) => {
  return useQuery<Employee>({
    queryKey: ['employee', employeeId],
    queryFn: async () => {
      const response = await client.api.employees[':employeeId'].$get({
        param: {
          employeeId,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch employee.');

      const { data } = await response.json();
      return data as Employee;
    },
    enabled: Boolean(employeeId),
  });
};
