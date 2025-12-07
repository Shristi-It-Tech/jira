import type { WithDocument } from '@/types/database';

export enum SprintStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export type Sprint = WithDocument<{
  workspaceId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: SprintStatus;
}>;
