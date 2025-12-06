import type { WithDocument } from '@/types/database';

export type Workspace = WithDocument<{
  name: string;
  imageId?: string;
  imageUrl?: string;
  userId: string;
  inviteCode: string;
}>;
