import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/queries';
import { SprintStatus } from '@/features/sprints/types';
import { TaskViewSwitcher } from '@/features/tasks/components/task-view-switcher';
import { SprintModel, connectToDatabase } from '@/lib/db';

interface CurrentSprintPageProps {
  params: {
    workspaceId: string;
  };
}

const CurrentSprintPage = async ({ params }: CurrentSprintPageProps) => {
  const user = await getCurrent();

  if (!user) redirect('/sign-in');

  await connectToDatabase();
  const sprintDoc = await SprintModel.findOne({ workspaceId: params.workspaceId, status: SprintStatus.OPEN }).sort({ startDate: 1 }).lean();

  const sprintId = sprintDoc?._id?.toString();

  return (
    <div className="flex h-full flex-col gap-4">
      {!sprintId && (
        <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          No sprint is currently marked as open. Create or open a sprint to see its tasks here.
        </div>
      )}

      <TaskViewSwitcher
        defaultSorting={[{ id: 'dueDate', desc: true }]}
        taskSource="current"
        lockedSprintId={sprintId}
        resetFiltersOnMount
      />
    </div>
  );
};

export default CurrentSprintPage;
