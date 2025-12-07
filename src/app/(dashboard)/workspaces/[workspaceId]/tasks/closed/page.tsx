import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/queries';
import { ClosedSprintsView } from '@/features/sprints/components/closed-sprints-view';
import type { Sprint } from '@/features/sprints/types';
import { SprintStatus } from '@/features/sprints/types';
import { SprintModel, connectToDatabase } from '@/lib/db';

interface ClosedSprintsPageProps {
  params: {
    workspaceId: string;
  };
}

const ClosedSprintsPage = async ({ params }: ClosedSprintsPageProps) => {
  const user = await getCurrent();

  if (!user) redirect('/sign-in');

  await connectToDatabase();

  const sprintDocs = await SprintModel.find({ workspaceId: params.workspaceId, status: SprintStatus.CLOSED }).sort({
    endDate: -1,
  });
  const sprints = sprintDocs.map((doc) => doc.toObject<Sprint>());

  return (
    <div className="flex h-full flex-col gap-4">
      <ClosedSprintsView sprints={sprints} />
    </div>
  );
};

export default ClosedSprintsPage;
