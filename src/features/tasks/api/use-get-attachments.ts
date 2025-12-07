import { useQuery } from '@tanstack/react-query';

import type { TaskAttachmentWithAuthor } from '@/features/tasks/types';
import { client } from '@/lib/hono';
import type { DocumentList } from '@/types/database';

interface UseGetAttachmentsProps {
  taskId: string;
}

type AttachmentsResponse = DocumentList<TaskAttachmentWithAuthor>;

export const useGetAttachments = ({ taskId }: UseGetAttachmentsProps) => {
  return useQuery<AttachmentsResponse>({
    queryKey: ['task-attachments', taskId],
    queryFn: async () => {
      const response = await client.api.tasks[':taskId']['attachments'].$get({
        param: { taskId },
      });

      if (!response.ok) {
        throw new Error('Failed to load attachments.');
      }

      const { data } = await response.json();
      return data as AttachmentsResponse;
    },
  });
};
