import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.members)['$post'], 200>;
type RequestType = InferRequestType<(typeof client.api.members)['$post']>;

export const useAddMember = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.members.$post({ json });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to add member.' }));
        throw new Error(error.error ?? 'Failed to add member.');
      }

      return response.json();
    },
    onSuccess: (_, { json }) => {
      toast.success('Member added to workspace.');

      queryClient.invalidateQueries({
        queryKey: ['members', json.workspaceId],
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add member.');
    },
  });
};
