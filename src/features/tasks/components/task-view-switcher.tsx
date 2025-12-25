'use client';

import type { SortingState } from '@tanstack/react-table';
import { Loader2, PlusIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBulkUpdateTasks } from '@/features/tasks/api/use-bulk-update-tasks';
import { useGetTasks } from '@/features/tasks/api/use-get-tasks';
import {
  LAST_TASK_ORIGIN_STORAGE_KEY,
  LAST_TASK_QUERY_STORAGE_KEY,
  LAST_TASK_SOURCE_STORAGE_KEY,
  LAST_TASK_VIEW_STORAGE_KEY,
  serializeTaskOrigin,
} from '@/features/tasks/constants';
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal';
import { useTaskFilters } from '@/features/tasks/hooks/use-task-filters';
import type { TaskStatus } from '@/features/tasks/types';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

import { getColumns } from './columns';
import { DataCalendar } from './data-calendar';
import { DataFilters } from './data-filters';
import { DataKanban } from './data-kanban';
import { DataSearch } from './data-search';
import { DataTable } from './data-table';

interface TaskViewSwitcherProps {
  projectId?: string;
  hideProjectFilter?: boolean;
  initialAssigneeId?: string | null;
  defaultSorting?: SortingState;
  taskSource?: 'all' | 'mine' | 'backlog' | 'current' | 'closed';
  lockedStatus?: TaskStatus;
  resetFiltersOnMount?: boolean;
  lockedSprintId?: string;
}

export const TaskViewSwitcher = ({
  projectId,
  hideProjectFilter,
  initialAssigneeId,
  defaultSorting,
  taskSource,
  lockedStatus,
  resetFiltersOnMount,
  lockedSprintId,
}: TaskViewSwitcherProps) => {
  const pathname = usePathname();
  const [view, setView] = useQueryState('task-view', {
    defaultValue: 'table',
  });
  const [filters, setFilters] = useTaskFilters();
  const { status, assigneeId, projectId: filteredProjectId, search, type, createdById } = filters;

  const workspaceId = useWorkspaceId();

  const { open } = useCreateTaskModal();
  const router = useRouter();
  const effectiveAssigneeId = assigneeId ?? initialAssigneeId ?? undefined;
  const tableColumns = useMemo(() => getColumns({ includeProjectColumn: !projectId }), [projectId]);
  const hasResetFilters = useRef(false);

  const effectiveStatus = lockedStatus ?? status;
  const effectiveProjectId = projectId ?? filteredProjectId ?? null;

  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    status: effectiveStatus,
    assigneeId: effectiveAssigneeId,
    projectId: effectiveProjectId ?? undefined,
    search,
    type,
    sprintId: lockedSprintId ?? undefined,
    createdById,
  });

  const { mutate: bulkUpdateTasks } = useBulkUpdateTasks();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (view) {
      window.sessionStorage.setItem(LAST_TASK_VIEW_STORAGE_KEY, view);
    }
  }, [view]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const originValue = serializeTaskOrigin(projectId ? { type: 'project', projectId } : { type: 'workspace' });
    window.sessionStorage.setItem(LAST_TASK_ORIGIN_STORAGE_KEY, originValue);
  }, [projectId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (taskSource) {
      window.sessionStorage.setItem(LAST_TASK_SOURCE_STORAGE_KEY, taskSource);
    }
  }, [taskSource]);

  useEffect(() => {
    if (resetFiltersOnMount || hasResetFilters.current) return;
    hasResetFilters.current = true;
    setFilters({
      projectId: projectId ?? null,
      assigneeId: initialAssigneeId ?? null,
      status: lockedStatus ?? null,
      type: null,
      search: null,
      createdById: null,
    });
  }, [resetFiltersOnMount, setFilters, projectId, initialAssigneeId, lockedStatus]);

  useEffect(() => {
    if (!initialAssigneeId || assigneeId) return;
    setFilters({ assigneeId: initialAssigneeId });
  }, [initialAssigneeId, assigneeId, setFilters]);

  useEffect(() => {
    if (!resetFiltersOnMount || hasResetFilters.current) return;
    hasResetFilters.current = true;
    setFilters({
      projectId: projectId ?? null,
      assigneeId: initialAssigneeId ?? null,
      status: lockedStatus ?? null,
      type: null,
      search: null,
      createdById: null,
    });
  }, [resetFiltersOnMount, setFilters, projectId, initialAssigneeId, lockedStatus]);

  useEffect(() => {
    if (!lockedStatus) return;
    if (status === lockedStatus) return;
    setFilters({ status: lockedStatus });
  }, [lockedStatus, status, setFilters]);

  const onKanbanChange = useCallback(
    (tasks: { $id: string; status: TaskStatus; position: number }[]) => {
      bulkUpdateTasks({
        json: { tasks },
      });
    },
    [bulkUpdateTasks],
  );

  const handleRowClick = useCallback(
    (taskId: string) => {
      const normalizedView = view ?? 'table';
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(LAST_TASK_QUERY_STORAGE_KEY, window.location.search);
      }
      params.set('task-view', normalizedView);

      if (projectId) {
        params.set('task-origin', 'project');
        params.set('origin-project-id', projectId);
      } else {
        params.set('task-origin', 'workspace');
      }

      if (taskSource) {
        params.set('task-source', taskSource);
      }

      const query = params.toString();
      router.push(`/workspaces/${workspaceId}/tasks/${taskId}${query ? `?${query}` : ''}`);
    },
    [router, workspaceId, view, projectId, taskSource],
  );

  return (
    <Tabs defaultValue={view} onValueChange={setView} className="w-full flex-1 rounded-lg border">
      <div className="flex h-full flex-col overflow-auto p-4">
        <div className="flex flex-col items-center justify-between gap-y-2 lg:flex-row">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>

            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>

            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>

          <Button onClick={() => open()} size="sm" className="w-full lg:w-auto">
            <PlusIcon className="size-4" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />

        <div className="flex flex-col justify-between gap-2 xl:flex-row xl:items-center">
          <DataFilters
            hideProjectFilter={hideProjectFilter}
            hideAssigneeFilter={taskSource === 'mine'}
            hideStatusFilter={Boolean(lockedStatus)}
          />

          <DataSearch />
        </div>

        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          <div className="flex h-[200px] w-full flex-col items-center justify-center rounded-lg border">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={tableColumns} data={tasks?.documents ?? []} onRowClick={handleRowClick} initialSorting={defaultSorting} />
            </TabsContent>

            <TabsContent value="kanban" className="mt-0">
              <DataKanban data={tasks?.documents ?? []} onChange={onKanbanChange} onTaskClick={handleRowClick} />
            </TabsContent>

            <TabsContent value="calendar" className="mt-0 h-full pb-4">
              <DataCalendar data={tasks?.documents ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
