import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/queries';
import { BACKLOG_SPRINT_ID } from '@/features/sprints/constants';
import { TaskViewSwitcher } from '@/features/tasks/components/task-view-switcher';

const BacklogTasksPage = async () => {
  const user = await getCurrent();

  if (!user) redirect('/sign-in');

  return (
    <div className="flex h-full flex-col">
      <TaskViewSwitcher
        defaultSorting={[{ id: 'dueDate', desc: true }]}
        taskSource="backlog"
        lockedSprintId={BACKLOG_SPRINT_ID}
        resetFiltersOnMount
      />
    </div>
  );
};

export default BacklogTasksPage;
