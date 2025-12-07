import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/queries';
import { getMember } from '@/features/members/utils';
import { TaskViewSwitcher } from '@/features/tasks/components/task-view-switcher';

interface TasksPageProps {
  params: {
    workspaceId: string;
  };
}

const TasksPage = async ({ params }: TasksPageProps) => {
  const user = await getCurrent();

  if (!user) redirect('/sign-in');

  const member = await getMember({ workspaceId: params.workspaceId, userId: user.$id });

  return (
    <div className="flex h-full flex-col">
      <TaskViewSwitcher initialAssigneeId={member?.$id ?? null} defaultSorting={[{ id: 'dueDate', desc: true }]} taskSource="mine" />
    </div>
  );
};
export default TasksPage;
