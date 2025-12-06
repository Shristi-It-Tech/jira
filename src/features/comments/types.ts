import type { Member } from '@/features/members/types';
import type { WithDocument } from '@/types/database';

export type CommentDocument = WithDocument<{
  workspaceId: string;
  taskId: string;
  memberId: string;
  body: string;
  parentId?: string;
  mentions?: string[];
}>;

export type Comment = Omit<CommentDocument, 'mentions'> & {
  mentions: string[];
};

export type CommentWithAuthor = Comment & {
  author?: Member;
};
