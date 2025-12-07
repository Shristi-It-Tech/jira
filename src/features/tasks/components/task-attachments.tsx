import { formatDistanceToNow } from 'date-fns';
import { CloudUpload, Download, Loader2, Paperclip, Trash2 } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { useDeleteAttachment } from '@/features/tasks/api/use-delete-attachment';
import { useGetAttachments } from '@/features/tasks/api/use-get-attachments';
import { useUploadAttachment } from '@/features/tasks/api/use-upload-attachment';
import { cn, formatFileSize } from '@/lib/utils';

interface TaskAttachmentsProps {
  taskId: string;
}

const MAX_ATTACHMENT_SIZE = 25 * 1024 * 1024; // 25MB

export const TaskAttachments = ({ taskId }: TaskAttachmentsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useGetAttachments({ taskId });
  const { mutateAsync: uploadAttachment, isPending: isUploading } = useUploadAttachment();
  const { mutate: deleteAttachment, isPending: isDeleting } = useDeleteAttachment();

  const handleFiles = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList?.length) return;

      for (const file of Array.from(fileList)) {
        if (!file || file.size === 0) continue;

        if (file.size > MAX_ATTACHMENT_SIZE) {
          toast.error(`"${file.name}" exceeds the 25MB size limit.`);
          continue;
        }

        await uploadAttachment({
          param: { taskId },
          form: { file },
        });
      }
    },
    [taskId, uploadAttachment],
  );

  const handleDelete = (attachmentId: string) => {
    setDeletingId(attachmentId);
    deleteAttachment(
      {
        param: { taskId, attachmentId },
      },
      {
        onSettled: () => setDeletingId(null),
      },
    );
  };

  const attachments = data?.documents ?? [];

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Attachments</p>

        <Button size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
          Upload
        </Button>
      </div>

      <DottedSeparator className="my-4" />

      <div
        onDragOver={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setIsDragging(false);
          void handleFiles(event.dataTransfer.files);
        }}
        className={cn(
          'flex min-h-[140px] flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 text-center transition',
          isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/40',
        )}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-y-2 text-sm text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
            Uploading files...
          </div>
        ) : (
          <>
            <CloudUpload className="mb-2 size-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Drag & drop files here, or click to browse.</p>
            <p className="text-xs text-muted-foreground">Up to 25MB per file.</p>
            <Button type="button" variant="ghost" size="sm" className="mt-3" onClick={() => fileInputRef.current?.click()}>
              Choose Files
            </Button>
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(event) => {
            void handleFiles(event.target.files);
            event.target.value = '';
          }}
        />
      </div>

      <DottedSeparator className="my-4" />

      {isLoading ? (
        <div className="flex items-center gap-x-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading attachments...
        </div>
      ) : attachments.length === 0 ? (
        <p className="text-sm italic text-muted-foreground">No attachments yet.</p>
      ) : (
        <ul className="space-y-3">
          {attachments.map((attachment) => (
            <li key={attachment.$id} className="flex items-center justify-between rounded-md border p-3">
              <div className="flex items-start gap-x-3">
                <Paperclip className="mt-1 size-4 text-muted-foreground" />

                <div className="space-y-1">
                  <p className="text-sm font-medium">{attachment.name}</p>
                  <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                    <span>{formatFileSize(attachment.size)}</span>
                    {attachment.uploader && (
                      <>
                        <span>&bull;</span>
                        <span>{attachment.uploader.name}</span>
                      </>
                    )}
                    <span>&bull;</span>
                    <span>{formatDistanceToNow(new Date(attachment.$createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-x-1">
                <Button variant="ghost" size="icon" asChild>
                  <a
                    href={`/api/tasks/${taskId}/attachments/${attachment.$id}/download`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Download attachment"
                  >
                    <Download className="size-4" />
                  </a>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(attachment.$id)}
                  disabled={isDeleting}
                  aria-label="Delete attachment"
                >
                  {isDeleting && deletingId === attachment.$id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
