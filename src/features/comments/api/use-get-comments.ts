import { useQuery } from '@tanstack/react-query';
import type { Models } from 'node-appwrite';

import type { CommentWithAuthor } from '@/features/comments/types';
import { client } from '@/lib/hono';

interface UseGetCommentsProps {
  taskId: string;
}

type CommentsResponse = Models.DocumentList<CommentWithAuthor>;

export const useGetComments = ({ taskId }: UseGetCommentsProps) => {
  const query = useQuery<CommentsResponse>({
    queryKey: ['comments', taskId],
    queryFn: async () => {
      const response = await client.api.tasks[':taskId'].comments.$get({
        param: {
          taskId,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch comments.');

      const { data } = await response.json();

      return data as CommentsResponse;
    },
    enabled: Boolean(taskId),
  });

  return query;
};
