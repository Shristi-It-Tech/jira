'use client';

import { usePathname } from 'next/navigation';

import { UserButton } from '@/features/auth/components/user-button';

import { MobileSidebar } from './mobile-sidebar';
import { SourceCode } from './source-code';

export const Navbar = () => {
  const pathname = usePathname();
  const pathnameParts = pathname.split('/');
  const section = pathnameParts[3];
  const subsection = pathnameParts[4];

  let title = 'Home';
  let description = 'Monitor all of your projects and tasks here.';

  if (section === 'tasks') {
    if (subsection === 'all') {
      title = 'All Tasks';
      description = 'Review every task in this workspace.';
    } else if (!subsection || subsection === '') {
      title = 'My Tasks';
      description = 'Tasks assigned to you in this workspace.';
    } else {
      title = 'Task Details';
      description = 'Inspect and manage this task.';
    }
  } else if (section === 'projects') {
    title = 'Projects';
    description = 'View tasks for your project here.';
  }

  return (
    <nav className="flex items-center justify-between px-6 pt-4">
      <div className="hidden flex-col lg:flex">
        <h1 className="text-2xl font-semibold">{title}</h1>

        <p className="text-muted-foreground">{description}</p>
      </div>

      <MobileSidebar />

      <div className="flex items-center gap-x-2.5">
        <UserButton />

        <SourceCode />
      </div>
    </nav>
  );
};
