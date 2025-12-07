'use client';

import { format } from 'date-fns';
import { CalendarDays, Loader2, Pencil } from 'lucide-react';
import { useState } from 'react';

import { DottedSeparator } from '@/components/dotted-separator';
import { ResponsiveModal } from '@/components/responsive-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetSprints } from '@/features/sprints/api/use-get-sprints';
import { EditSprintForm } from '@/features/sprints/components/edit-sprint-form';
import type { Sprint } from '@/features/sprints/types';
import { SprintStatus } from '@/features/sprints/types';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

export const SprintList = () => {
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetSprints({ workspaceId });
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);

  const sprints = data?.documents ?? [];

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">Sprints</CardTitle>
          <p className="text-sm text-muted-foreground">
            {sprints.length} sprint{sprints.length === 1 ? '' : 's'}
          </p>
        </div>
      </CardHeader>

      <DottedSeparator className="mx-6" />

      <CardContent className="pt-6">
        {isLoading ? (
          <div className="flex items-center gap-x-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading sprints...
          </div>
        ) : sprints.length === 0 ? (
          <p className="text-sm italic text-muted-foreground">No sprints found. Create one to get started.</p>
        ) : (
          <ul className="space-y-3">
            {sprints.map((sprint) => (
              <li key={sprint.$id} className="rounded-lg border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-base font-semibold">{sprint.name}</p>
                      <Badge variant={sprint.status === SprintStatus.OPEN ? 'secondary' : 'outline'}>
                        {sprint.status === SprintStatus.OPEN ? 'Open' : 'Closed'}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="mr-1 size-4" />
                      <span>{format(new Date(sprint.startDate), 'PPP')}</span>
                      <span>to</span>
                      <span>{format(new Date(sprint.endDate), 'PPP')}</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 shrink-0"
                    onClick={() => setEditingSprint(sprint)}
                    aria-label={`Edit ${sprint.name}`}
                  >
                    <Pencil className="size-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <ResponsiveModal
        title="Edit Sprint"
        description="Update sprint dates, status, or name."
        open={!!editingSprint}
        onOpenChange={(open) => {
          if (!open) {
            setEditingSprint(null);
          }
        }}
      >
        {editingSprint && <EditSprintForm sprint={editingSprint} onCancel={() => setEditingSprint(null)} />}
      </ResponsiveModal>
    </Card>
  );
};
