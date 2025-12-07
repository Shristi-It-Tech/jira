import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/queries';
import { SprintsView } from '@/features/sprints/components/sprints-view';

const WorkspaceSprintsPage = async () => {
  const user = await getCurrent();

  if (!user) redirect('/sign-in');

  return (
    <div className="flex h-full flex-col">
      <SprintsView />
    </div>
  );
};

export default WorkspaceSprintsPage;
