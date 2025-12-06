import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.employees)[':employeeId']['$delete'], 200>;
type RequestType = InferRequestType<(typeof client.api.employees)[':employeeId']['$delete']>;

export const useDeleteEmployee = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (payload) => {
      const response = await client.api.employees[':employeeId']['$delete'](payload);

      if (!response.ok) throw new Error('Failed to delete employee.');

      return response.json();
    },
    onSuccess: () => {
      toast.success('Employee removed.');
      queryClient.invalidateQueries({ queryKey: ['employees', workspaceId] });
    },
    onError: () => {
      toast.error('Failed to delete employee.');
    },
  });
};
