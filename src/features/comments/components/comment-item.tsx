import { formatDistanceToNow } from 'date-fns';

import { Button } from '@/components/ui/button';
import { useDeleteComment } from '@/features/comments/api/use-delete-comment';
import type { CommentWithAuthor } from '@/features/comments/types';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import type { Member } from '@/features/members/types';
import { MemberRole } from '@/features/members/types';

interface CommentItemProps {
  comment: CommentWithAuthor;
  onReply: (comment: CommentWithAuthor) => void;
  currentMember?: Member;
}

export const CommentItem = ({ comment, onReply, currentMember }: CommentItemProps) => {
  const authorName = comment.author?.name ?? 'Unknown Member';
  const canDelete = !!currentMember && (currentMember.role === MemberRole.ADMIN || currentMember.$id === comment.memberId);

  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment({
    taskId: comment.taskId,
  });

  const handleDelete = () => {
    deleteComment({ commentId: comment.$id });
  };

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-x-3">
        <MemberAvatar name={authorName} className="size-10" />

        <div className="flex flex-col text-sm">
          <span className="font-semibold">{authorName}</span>
          <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.$createdAt), { addSuffix: true })}</span>
        </div>

        <div className="ml-auto flex items-center gap-x-1">
          <Button variant="ghost" size="sm" className="text-xs" onClick={() => onReply(comment)}>
            Reply
          </Button>

          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-destructive hover:text-destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          )}
        </div>
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{comment.body}</p>
    </div>
  );
};
