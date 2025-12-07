import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.tasks)[':taskId']['attachments'][':attachmentId']['$delete'], 200>;
type RequestType = InferRequestType<(typeof client.api.tasks)[':taskId']['attachments'][':attachmentId']['$delete']>;

export const useDeleteAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.tasks[':taskId']['attachments'][':attachmentId'].$delete({
        param,
      });

      if (!response.ok) throw new Error('Failed to delete attachment.');

      return await response.json();
    },
    onSuccess: (_data, { param }) => {
      toast.success('Attachment deleted.');

      queryClient.invalidateQueries({
        queryKey: ['task-attachments', param.taskId],
        exact: true,
      });
    },
    onError: (error) => {
      console.error('[DELETE_ATTACHMENT]', error);
      toast.error('Failed to delete attachment.');
    },
  });
};
