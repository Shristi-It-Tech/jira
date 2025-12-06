import type { WithDocument } from '@/types/database';

export enum MemberRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export type MemberDocument = WithDocument<{
  workspaceId: string;
  userId: string;
  employeeId?: string;
  role: MemberRole;
}>;

export type Member = MemberDocument & {
  name: string;
  email: string;
};
