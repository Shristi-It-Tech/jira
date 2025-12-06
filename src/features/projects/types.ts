import type { WithDocument } from '@/types/database';

export type Project = WithDocument<{
  name: string;
  imageId?: string;
  imageUrl?: string;
  workspaceId: string;
}>;
