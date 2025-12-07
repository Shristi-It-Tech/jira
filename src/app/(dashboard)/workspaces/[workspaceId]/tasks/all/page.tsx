import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/queries';
import { TaskViewSwitcher } from '@/features/tasks/components/task-view-switcher';

const AllTasksPage = async () => {
  const user = await getCurrent();

  if (!user) redirect('/sign-in');

  return (
    <div className="flex h-full flex-col">
      <TaskViewSwitcher
        defaultSorting={[{ id: 'dueDate', desc: true }]}
        taskSource="all"
      />
    </div>
  );
};

export default AllTasksPage;
