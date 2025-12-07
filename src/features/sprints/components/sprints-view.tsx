'use client';

import { CreateSprintForm } from '@/features/sprints/components/create-sprint-form';
import { SprintList } from '@/features/sprints/components/sprint-list';

export const SprintsView = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px,1fr]">
        <CreateSprintForm />
        <SprintList />
      </div>
    </div>
  );
};
