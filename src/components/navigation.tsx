'use client';

import { Flag, Settings, UsersIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GoArchive, GoCheckCircle, GoCheckCircleFill, GoFlame, GoHome, GoHomeFill, GoListUnordered } from 'react-icons/go';

import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';

const routes = [
  {
    label: 'Home',
    href: '',
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: 'All Tasks',
    href: '/tasks/all',
    icon: GoListUnordered,
    activeIcon: GoListUnordered,
  },
  {
    label: 'Current Sprint',
    href: '/tasks/current',
    icon: GoFlame,
    activeIcon: GoFlame,
  },
  {
    label: 'Backlog',
    href: '/tasks/backlog',
    icon: GoArchive,
    activeIcon: GoArchive,
  },
  {
    label: 'My Tasks',
    href: '/tasks',
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: 'Sprints',
    href: '/sprints',
    icon: Flag,
    activeIcon: Flag,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    activeIcon: Settings,
  },
  {
    label: 'Members',
    href: '/members',
    icon: UsersIcon,
    activeIcon: UsersIcon,
  },
];

export const Navigation = () => {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();

  return (
    <ul className="flex flex-col">
      {routes.map((route) => {
        const fullHref = `/workspaces/${workspaceId}${route.href}`;
        const isActive = pathname === fullHref;
        const Icon = isActive ? route.activeIcon : route.icon;

        return (
          <li key={fullHref}>
            <Link
              href={fullHref}
              className={cn(
                'flex items-center gap-2.5 rounded-md p-2.5 font-medium text-neutral-500 transition hover:text-primary',
                isActive && 'bg-white text-primary shadow-sm hover:opacity-100',
              )}
            >
              <Icon className="size-5 text-neutral-500" />
              {route.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
