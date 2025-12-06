// @ts-nocheck
import type { MemberDocument } from '@/features/members/types';
import { MemberModel, connectToDatabase } from '@/lib/db';

interface GetMemberProps {
  workspaceId: string;
  userId: string;
}

export const getMember = async ({ workspaceId, userId }: GetMemberProps) => {
  await connectToDatabase();

  const member = await MemberModel.findOne({
    workspaceId,
    userId,
  }).exec();

  return member ? member.toObject<MemberDocument>() : null;
};
