import { useMemo, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetComments } from '@/features/comments/api/use-get-comments';
import type { CommentWithAuthor } from '@/features/comments/types';
import { useGetMembers } from '@/features/members/api/use-get-members';
import type { Member } from '@/features/members/types';

import { CommentForm } from './comment-form';
import { CommentItem } from './comment-item';

interface TaskCommentsProps {
  taskId: string;
  workspaceId: string;
}

type CommentNode = CommentWithAuthor & {
  replies: CommentNode[];
};

const buildCommentTree = (comments: CommentWithAuthor[]): CommentNode[] => {
  const nodes = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  comments.forEach((comment) => {
    nodes.set(comment.$id, { ...comment, mentions: comment.mentions ?? [], replies: [] });
  });

  nodes.forEach((comment) => {
    if (comment.parentId && nodes.has(comment.parentId)) {
      nodes.get(comment.parentId)!.replies.push(comment);
    } else {
      roots.push(comment);
    }
  });

  return roots;
};

export const TaskComments = ({ taskId, workspaceId }: TaskCommentsProps) => {
  const [replyTo, setReplyTo] = useState<CommentWithAuthor | null>(null);

  const { data: commentsData, isLoading: isLoadingComments } = useGetComments({ taskId });
  const { data: membersData, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });

  const members: Member[] = membersData?.documents ?? [];

  const commentTree = useMemo(() => {
    if (!commentsData?.documents) return [];

    return buildCommentTree(commentsData.documents);
  }, [commentsData]);

  const isLoading = isLoadingComments || isLoadingMembers;

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Comments ({commentsData?.total ?? 0})</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <CommentForm taskId={taskId} members={members} replyTo={replyTo} onCancelReply={() => setReplyTo(null)} />

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading comments...</p>
        ) : commentTree.length === 0 ? (
          <p className="text-sm text-muted-foreground">No comments yet.</p>
        ) : (
          <div className="space-y-4">
            {commentTree.map((comment) => (
              <CommentThread key={comment.$id} comment={comment} onReply={setReplyTo} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface CommentThreadProps {
  comment: CommentNode;
  onReply: (comment: CommentWithAuthor) => void;
}

const CommentThread = ({ comment, onReply }: CommentThreadProps) => {
  return (
    <div className="space-y-4">
      <CommentItem comment={comment} onReply={onReply} />

      {comment.replies.length > 0 && (
        <div className="ml-6 border-l pl-4">
          {comment.replies.map((reply) => (
            <CommentThread key={reply.$id} comment={reply} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
};
