import { useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCreateComment } from '@/features/comments/api/use-create-comment';
import type { CommentWithAuthor } from '@/features/comments/types';
import type { Member } from '@/features/members/types';

interface CommentFormProps {
  taskId: string;
  members: Member[];
  replyTo?: CommentWithAuthor | null;
  onCancelReply: () => void;
}

export const CommentForm = ({ taskId, members, replyTo, onCancelReply }: CommentFormProps) => {
  const [value, setValue] = useState('');
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionStart, setMentionStart] = useState<number | null>(null);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { mutate, isPending } = useCreateComment(taskId);

  useEffect(() => {
    if (!replyTo) return;

    textareaRef.current?.focus();
  }, [replyTo]);

  const filteredMembers = useMemo(() => {
    if (mentionQuery === null) return [];

    return members.filter((member) => member.name.toLowerCase().includes(mentionQuery.toLowerCase()));
  }, [members, mentionQuery]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextValue = event.target.value;
    const selectionStart = event.target.selectionStart;

    setValue(nextValue);
    setCursorPosition(selectionStart);

    const textBeforeCursor = nextValue.slice(0, selectionStart);
    const mentionMatch = textBeforeCursor.match(/@([\w]*)$/i);

    if (mentionMatch) {
      setMentionQuery(mentionMatch[1]);
      setMentionStart(selectionStart - mentionMatch[0].length);
    } else {
      setMentionQuery(null);
      setMentionStart(null);
    }
  };

  const insertMention = (member: Member) => {
    if (mentionStart === null) return;

    const before = value.slice(0, mentionStart);
    const after = value.slice(cursorPosition);
    const mentionText = `@${member.name}`;
    const nextValue = `${before}${mentionText} ${after}`;

    setValue(nextValue);
    setMentionQuery(null);
    setMentionStart(null);

    const caretPosition = before.length + mentionText.length + 1;

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(caretPosition, caretPosition);
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!value.trim()) return;

    const mentions = Array.from(new Set(members.filter((member) => value.includes(`@${member.name}`)).map((member) => member.$id)));

    mutate(
      {
        param: { taskId },
        json: {
          body: value.trim(),
          parentId: replyTo?.$id,
          mentions,
        },
      },
      {
        onSuccess: () => {
          setValue('');
          setMentionQuery(null);
          setMentionStart(null);
          onCancelReply();
        },
      },
    );
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      {replyTo ? (
        <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
          <span>
            Replying to <strong>{replyTo.author?.name ?? 'comment'}</strong>
          </span>
          <Button variant="ghost" size="sm" type="button" onClick={onCancelReply}>
            Cancel
          </Button>
        </div>
      ) : null}

      <div className="relative">
        <Textarea ref={textareaRef} placeholder="Leave a comment..." value={value} rows={4} onChange={handleChange} disabled={isPending} />

        {mentionQuery !== null && (
          <div className="absolute left-0 right-0 top-full z-10 mt-2 max-h-48 overflow-y-auto rounded-md border bg-white shadow-lg">
            {filteredMembers.length === 0 ? (
              <p className="p-3 text-sm text-muted-foreground">No members found.</p>
            ) : (
              filteredMembers.map((member) => (
                <button
                  type="button"
                  key={member.$id}
                  className="flex w-full items-center gap-x-2 px-3 py-2 text-left text-sm hover:bg-muted"
                  onClick={() => insertMention(member)}
                >
                  @{member.name}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Posting comment...' : 'Post comment'}
      </Button>
    </form>
  );
};
