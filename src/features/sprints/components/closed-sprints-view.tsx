'use client';

import { format } from 'date-fns';
import { ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';

import type { Sprint } from '@/features/sprints/types';
import { TaskViewSwitcher } from '@/features/tasks/components/task-view-switcher';

interface ClosedSprintsViewProps {
  sprints: Sprint[];
}

export const ClosedSprintsView = ({ sprints }: ClosedSprintsViewProps) => {
  const pathname = usePathname() ?? '';

  if (!sprints.length) {
    return (
      <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
        There are no closed sprints yet. Close an active sprint to review its tasks here.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sprints.map((sprint, index) => {
        const storageKey = `${pathname}:${sprint.$id}:closed-sprint`;

        return (
          <details key={sprint.$id} className="group overflow-hidden rounded-lg border bg-card text-card-foreground" open={index === 0}>
            <summary className="flex cursor-pointer items-center justify-between gap-2 px-4 py-3 font-medium [&::-webkit-details-marker]:hidden">
              <div>
                <p className="text-base font-semibold">{sprint.name}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(sprint.startDate), 'PPP')} - {format(new Date(sprint.endDate), 'PPP')}
                </p>
              </div>

              <ChevronDown className="size-4 text-muted-foreground transition group-open:rotate-180" />
            </summary>

            <div className="border-t px-2 py-4">
              <TaskViewSwitcher
                defaultSorting={[{ id: 'dueDate', desc: true }]}
                taskSource="closed"
                lockedSprintId={sprint.$id}
                storageKey={storageKey}
                resetFiltersOnMount
              />
            </div>
          </details>
        );
      })}
    </div>
  );
};
