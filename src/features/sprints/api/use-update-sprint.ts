import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.sprints)[':sprintId']['$patch'], 200>;
type RequestType = InferRequestType<(typeof client.api.sprints)[':sprintId']['$patch']>;

export const useUpdateSprint = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.sprints[':sprintId']['$patch']({
        json,
        param,
      });

      if (!response.ok) {
        throw new Error('Failed to update sprint.');
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success('Sprint updated.');

      queryClient.invalidateQueries({
        queryKey: ['sprints', data.workspaceId],
        exact: true,
      });
    },
    onError: (error) => {
      console.error('[UPDATE_SPRINT]: ', error);
      toast.error('Failed to update sprint.');
    },
  });
};
