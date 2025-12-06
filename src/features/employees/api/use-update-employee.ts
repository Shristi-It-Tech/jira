import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.employees)[':employeeId']['$patch'], 200>;
type RequestType = InferRequestType<(typeof client.api.employees)[':employeeId']['$patch']>;

export const useUpdateEmployee = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (payload) => {
      const response = await client.api.employees[':employeeId']['$patch'](payload);

      if (!response.ok) throw new Error('Failed to update employee.');

      return response.json();
    },
    onSuccess: ({ data }) => {
      toast.success('Employee updated.');
      queryClient.invalidateQueries({ queryKey: ['employee', data.$id] });
      queryClient.invalidateQueries({ queryKey: ['employees', workspaceId] });
    },
    onError: () => {
      toast.error('Failed to update employee.');
    },
  });
};
