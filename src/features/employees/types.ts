import type { WithDocument } from '@/types/database';

export enum EmploymentStatus {
  ACTIVE = 'ACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  TERMINATED = 'TERMINATED',
}

export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERN = 'INTERN',
}

export type Employee = WithDocument<{
  workspaceId: string;
  name: string;
  email: string;
  department?: string;
  jobTitle?: string;
  startDate: string;
  managerId?: string;
  location?: string;
  employmentStatus: EmploymentStatus;
  employmentType: EmploymentType;
}>;
