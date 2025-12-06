import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.employees)['$post'], 200>;
type RequestType = InferRequestType<(typeof client.api.employees)['$post']>;

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (payload) => {
      const response = await client.api.employees.$post(payload);

      if (!response.ok) throw new Error('Failed to create employee.');

      return response.json();
    },
    onSuccess: ({ data }) => {
      toast.success('Employee created.');
      queryClient.invalidateQueries({ queryKey: ['employees', data.workspaceId] });
    },
    onError: () => {
      toast.error('Failed to create employee.');
    },
  });
};
