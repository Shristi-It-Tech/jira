import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.tasks)[':taskId']['comments']['$post'], 200>;
type RequestType = InferRequestType<(typeof client.api.tasks)[':taskId']['comments']['$post']>;

export const useCreateComment = (taskId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (payload) => {
      const response = await client.api.tasks[':taskId'].comments.$post(payload);

      if (!response.ok) throw new Error('Failed to create comment.');

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments', taskId],
      });

      toast.success('Comment added.');
    },
    onError: () => {
      toast.error('Failed to add comment.');
    },
  });

  return mutation;
};
