import { formatDistanceToNow } from 'date-fns';

import { Button } from '@/components/ui/button';
import type { CommentWithAuthor } from '@/features/comments/types';
import { MemberAvatar } from '@/features/members/components/member-avatar';

interface CommentItemProps {
  comment: CommentWithAuthor;
  onReply: (comment: CommentWithAuthor) => void;
}

export const CommentItem = ({ comment, onReply }: CommentItemProps) => {
  const authorName = comment.author?.name ?? 'Unknown Member';

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-x-3">
        <MemberAvatar name={authorName} className="size-10" />

        <div className="flex flex-col text-sm">
          <span className="font-semibold">{authorName}</span>
          <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.$createdAt), { addSuffix: true })}</span>
        </div>

        <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={() => onReply(comment)}>
          Reply
        </Button>
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{comment.body}</p>
    </div>
  );
};
