'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { PageError } from '@/components/page-error';
import { PageLoader } from '@/components/page-loader';
import { TaskComments } from '@/features/comments/components/task-comments';
import { useGetTask } from '@/features/tasks/api/use-get-task';
import { TaskAttachments } from '@/features/tasks/components/task-attachments';
import { TaskBreadcrumbs } from '@/features/tasks/components/task-breadcrumbs';
import { TaskDescription } from '@/features/tasks/components/task-description';
import { TaskOverview } from '@/features/tasks/components/task-overview';
import { useTaskId } from '@/features/tasks/hooks/use-task-id';

export const TaskIdClient = () => {
  const taskId = useTaskId();

  const { data: task, isLoading } = useGetTask({ taskId });

  if (isLoading) return <PageLoader />;

  if (!task) return <PageError message="Task not found." />;

  return (
    <div className="flex flex-col">
      <TaskBreadcrumbs project={task.project} task={task} />

      <DottedSeparator className="my-6" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TaskOverview task={task} />
        <div className="flex flex-col gap-4">
          <TaskDescription task={task} />
          <TaskAttachments taskId={task.$id} />
        </div>
      </div>

      <div className="mt-6">
        <TaskComments taskId={task.$id} workspaceId={task.workspaceId} />
      </div>
    </div>
  );
};
