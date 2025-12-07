import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.sprints)['$post'], 200>;
type RequestType = InferRequestType<(typeof client.api.sprints)['$post']>;

export const useCreateSprint = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.sprints.$post({ json });

      if (!response.ok) throw new Error('Failed to create sprint.');

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success('Sprint created.');

      queryClient.invalidateQueries({
        queryKey: ['sprints', data.workspaceId],
        exact: true,
      });
    },
    onError: (error) => {
      console.error('[CREATE_SPRINT]', error);
      toast.error('Failed to create sprint.');
    },
  });
};
