import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.tasks)[':taskId']['attachments']['$post'], 200>;
type RequestType = InferRequestType<(typeof client.api.tasks)[':taskId']['attachments']['$post']>;

export const useUploadAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.tasks[':taskId']['attachments'].$post({
        param,
        form,
      });

      if (!response.ok) throw new Error('Failed to upload attachment.');

      return await response.json();
    },
    onSuccess: (_data, { param }) => {
      toast.success('Attachment uploaded.');

      queryClient.invalidateQueries({
        queryKey: ['task-attachments', param.taskId],
        exact: true,
      });
    },
    onError: (error) => {
      console.error('[UPLOAD_ATTACHMENT]', error);
      toast.error('Failed to upload attachment.');
    },
  });
};
