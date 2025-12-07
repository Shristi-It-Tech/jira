import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.tasks)[':taskId']['comments'][':commentId']['$delete'], 200>;

interface DeleteCommentVariables {
  commentId: string;
}

interface UseDeleteCommentProps {
  taskId: string;
}

export const useDeleteComment = ({ taskId }: UseDeleteCommentProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, DeleteCommentVariables>({
    mutationFn: async ({ commentId }) => {
      const response = await client.api.tasks[':taskId'].comments[':commentId'].$delete({
        param: { taskId, commentId },
      });

      if (!response.ok) throw new Error('Failed to delete comment.');

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Comment deleted.');
      queryClient.invalidateQueries({
        queryKey: ['comments', taskId],
      });
    },
    onError: () => {
      toast.error('Failed to delete comment.');
    },
  });

  return mutation;
};
