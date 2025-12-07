import { Folder, ListChecks, Tag, UserIcon } from 'lucide-react';

import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { useTaskFilters } from '@/features/tasks/hooks/use-task-filters';
import { TASK_TYPE_LABELS, TaskStatus, TaskType } from '@/features/tasks/types';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

interface DataFiltersProps {
  hideProjectFilter?: boolean;
  hideAssigneeFilter?: boolean;
}

export const DataFilters = ({ hideProjectFilter, hideAssigneeFilter }: DataFiltersProps) => {
  const workspaceId = useWorkspaceId();

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });

  const isLoading = isLoadingProjects || isLoadingMembers;

  const projectOptions = projects?.documents.map((project) => ({
    value: project.$id,
    label: project.name,
  }));

  const memberOptions = members?.documents.map((member) => ({
    value: member.$id,
    label: member.name,
  }));

  const [{ status, assigneeId, projectId, type }, setFilters] = useTaskFilters();

  const onStatusChange = (value: string) => {
    setFilters({ status: value === 'all' ? null : (value as TaskStatus) });
  };

  const onAssigneeChange = (value: string) => {
    setFilters({ assigneeId: value === 'all' ? null : (value as string) });
  };

  const onTypeChange = (value: string) => {
    setFilters({ type: value === 'all' ? null : (value as TaskType) });
  };

  const onProjectChange = (value: string) => {
    setFilters({ projectId: value === 'all' ? null : (value as string) });
  };

  if (isLoading) return null;

  return (
    <div className="flex flex-col gap-2 lg:flex-row">
      {!hideProjectFilter && (
        <Select defaultValue={projectId ?? undefined} onValueChange={onProjectChange}>
          <SelectTrigger className="h-8 w-full lg:w-auto">
            <div className="flex items-center pr-2">
              <Folder className="mr-2 size-4" />
              <SelectValue placeholder="All projects" />
            </div>
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All projects</SelectItem>
            <SelectSeparator />

            {projectOptions?.map((project) => (
              <SelectItem key={project.value} value={project.value}>
                {project.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {!hideAssigneeFilter && (
        <Select defaultValue={assigneeId ?? undefined} onValueChange={onAssigneeChange}>
          <SelectTrigger className="h-8 w-full lg:w-auto">
            <div className="flex items-center pr-2">
              <UserIcon className="mr-2 size-4" />
              <SelectValue placeholder="All assignees" />
            </div>
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All assignees</SelectItem>
            <SelectSeparator />

            {memberOptions?.map((member) => (
              <SelectItem key={member.value} value={member.value}>
                {member.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select defaultValue={status ?? undefined} onValueChange={onStatusChange}>
        <SelectTrigger className="h-8 w-full lg:w-auto">
          <div className="flex items-center pr-2">
            <ListChecks className="mr-2 size-4" />
            <SelectValue placeholder="All statuses" />
          </div>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectSeparator />

          <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
          <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue={type ?? undefined} onValueChange={onTypeChange}>
        <SelectTrigger className="h-8 w-full lg:w-auto">
          <div className="flex items-center pr-2">
            <Tag className="mr-2 size-4" />
            <SelectValue placeholder="All types" />
          </div>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          <SelectSeparator />

          {Object.values(TaskType).map((taskType) => (
            <SelectItem key={taskType} value={taskType}>
              {TASK_TYPE_LABELS[taskType]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
