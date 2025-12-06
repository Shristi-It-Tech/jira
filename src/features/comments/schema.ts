import { z } from 'zod';

export const createCommentSchema = z.object({
  body: z.string().trim().min(1, 'Comment cannot be empty.'),
  parentId: z.string().trim().optional(),
  mentions: z.array(z.string()).optional(),
});
