import { format } from 'date-fns';
import { Pencil } from 'lucide-react';

import { DottedSeparator } from '@/components/dotted-separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { BACKLOG_SPRINT_LABEL } from '@/features/sprints/constants';
import { useEditTaskModal } from '@/features/tasks/hooks/use-edit-task-modal';
import { TASK_TYPE_LABELS, TaskType, type TaskWithRelations } from '@/features/tasks/types';
import { snakeCaseToTitleCase } from '@/lib/utils';

import { OverviewProperty } from './overview-property';
import { TaskDate } from './task-date';

interface TaskOverviewProps {
  task: TaskWithRelations;
}

export const TaskOverview = ({ task }: TaskOverviewProps) => {
  const { open } = useEditTaskModal();

  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="rounded-lg bg-muted p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Overview</p>

          <Button onClick={() => open(task.$id)} size="sm" variant="secondary">
            <Pencil className="mr-2 size-4" />
            Edit
          </Button>
        </div>

        <DottedSeparator className="my-4" />

        <div className="flex flex-col gap-y-4">
          <OverviewProperty label="Assignee">
            <MemberAvatar name={task.assignee.name} className="size-6" />

            <p className="text-sm font-medium">{task.assignee.name}</p>
          </OverviewProperty>

          <OverviewProperty label="Created By">
            {task.createdBy ? (
              <>
                <MemberAvatar name={task.createdBy.name} className="size-6" />

                <p className="text-sm font-medium">{task.createdBy.name}</p>
              </>
            ) : (
              <p className="text-sm font-medium text-muted-foreground">Unknown</p>
            )}
          </OverviewProperty>

          <OverviewProperty label="Type">
            <p className="text-sm font-medium">{TASK_TYPE_LABELS[task.type ?? TaskType.TASK]}</p>
          </OverviewProperty>

          <OverviewProperty label="Sprint">
            {task.sprint ? (
              <p className="text-sm font-medium">{task.sprint.name}</p>
            ) : (
              <p className="text-sm font-medium text-muted-foreground">{BACKLOG_SPRINT_LABEL}</p>
            )}
          </OverviewProperty>

          <OverviewProperty label="Created">
            <p className="text-sm font-medium text-muted-foreground">{format(new Date(task.$createdAt), 'PPP')}</p>
          </OverviewProperty>

          <OverviewProperty label="Due Date">
            <TaskDate value={task.dueDate} className="text-sm font-medium" />
          </OverviewProperty>

          <OverviewProperty label="Status">
            <Badge variant={task.status}>{snakeCaseToTitleCase(task.status)}</Badge>
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
};
