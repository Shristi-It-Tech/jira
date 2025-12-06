import { Models } from 'node-appwrite';

import type { Member } from '@/features/members/types';

export type CommentDocument = Models.Document & {
  workspaceId: string;
  taskId: string;
  memberId: string;
  body: string;
  parentId?: string;
  mentions?: string[];
};

export type Comment = Omit<CommentDocument, 'mentions'> & {
  mentions: string[];
};

export type CommentWithAuthor = Comment & {
  author?: Member;
};
