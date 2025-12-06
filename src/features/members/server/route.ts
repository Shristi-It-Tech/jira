// @ts-nocheck
import { zValidator } from '@hono/zod-validator';
import bcrypt from 'bcryptjs';
import { Hono } from 'hono';
import { z } from 'zod';

import { type Member, type MemberDocument, MemberRole } from '@/features/members/types';
import { getMember } from '@/features/members/utils';
import { EmployeeModel, MemberModel, UserModel, connectToDatabase } from '@/lib/db';
import { sessionMiddleware } from '@/lib/session-middleware';

const app = new Hono()
  .use(async (_ctx, next) => {
    await connectToDatabase();
    return next();
  })
  .get(
    '/',
    sessionMiddleware,
    zValidator(
      'query',
      z.object({
        workspaceId: z.string(),
      }),
    ),
    async (ctx) => {
      const user = ctx.get('user');
      const { workspaceId } = ctx.req.valid('query');

      const member = await getMember({ workspaceId, userId: user.$id });

      if (!member) {
        return ctx.json({ error: 'Unauthorized.' }, 401);
      }

      const memberDocs = await MemberModel.find({ workspaceId }).exec();
      const userIds = memberDocs.map((doc) => doc.userId);

      const users = await UserModel.find({ _id: { $in: userIds } }).exec();
      const userMap = new Map(users.map((doc) => [doc._id.toString(), doc]));

      const members: Member[] = memberDocs.map((doc) => {
        const memberData = doc.toObject<MemberDocument>();
        const relatedUser = userMap.get(memberData.userId);

        return {
          ...memberData,
          name: relatedUser?.name ?? '',
          email: relatedUser?.email ?? '',
        };
      });

      return ctx.json({
        data: {
          documents: members,
          total: members.length,
        },
      });
    },
  )
  .post(
    '/',
    sessionMiddleware,
    zValidator(
      'json',
      z.object({
        workspaceId: z.string(),
        email: z.string().email(),
        name: z.string().trim().optional(),
        password: z.string().min(8).optional(),
        role: z.nativeEnum(MemberRole).default(MemberRole.MEMBER),
      }),
    ),
    async (ctx) => {
      const user = ctx.get('user');
      const { workspaceId, email, role, name, password } = ctx.req.valid('json');

      const currentMember = await getMember({ workspaceId, userId: user.$id });

      if (!currentMember || currentMember.role !== MemberRole.ADMIN) {
        return ctx.json({ error: 'Unauthorized.' }, 401);
      }

      const normalizedEmail = email.toLowerCase();

      let userDoc = await UserModel.findOne({ email: normalizedEmail }).exec();

      if (!userDoc) {
        if (!name || !password) {
          return ctx.json({ error: 'Name and password are required to create an account for this member.' }, 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        userDoc = await UserModel.create({
          name,
          email: normalizedEmail,
          password: hashedPassword,
        });
      }

      const existingMember = await MemberModel.findOne({ workspaceId, userId: userDoc._id.toString() }).exec();

      if (existingMember) {
        return ctx.json({ error: 'Already a member.' }, 400);
      }

      const employeeDoc = await EmployeeModel.findOne({ workspaceId, email: normalizedEmail }).exec();

      const memberDoc = await MemberModel.create({
        workspaceId,
        userId: userDoc._id.toString(),
        employeeId: employeeDoc?._id.toString(),
        role,
      });

      return ctx.json({
        data: {
          $id: memberDoc._id.toString(),
          workspaceId,
        },
      });
    },
  )
  .delete('/:memberId', sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const { memberId } = ctx.req.param();

    const memberDoc = await MemberModel.findById(memberId).exec();

    if (!memberDoc) {
      return ctx.json({ error: 'Member not found.' }, 404);
    }

    const workspaceId = memberDoc.workspaceId;
    const memberCount = await MemberModel.countDocuments({ workspaceId });

    if (memberCount === 1) {
      return ctx.json({ error: 'Cannot delete the only member.' }, 400);
    }

    const currentMember = await getMember({ workspaceId, userId: user.$id });

    if (!currentMember || currentMember.role !== MemberRole.ADMIN) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    await MemberModel.findByIdAndDelete(memberId);

    return ctx.json({
      data: {
        $id: memberId,
        workspaceId,
      },
    });
  })
  .patch(
    '/:memberId',
    sessionMiddleware,
    zValidator(
      'json',
      z.object({
        role: z.nativeEnum(MemberRole),
      }),
    ),
    async (ctx) => {
      const user = ctx.get('user');
      const { memberId } = ctx.req.param();
      const { role } = ctx.req.valid('json');

      const memberDoc = await MemberModel.findById(memberId).exec();

      if (!memberDoc) {
        return ctx.json({ error: 'Member not found.' }, 404);
      }

      const workspaceId = memberDoc.workspaceId;
      const memberCount = await MemberModel.countDocuments({ workspaceId });

      if (memberCount === 1) {
        return ctx.json({ error: 'Cannot downgrade the only member.' }, 400);
      }

      const currentMember = await getMember({ workspaceId, userId: user.$id });

      if (!currentMember || currentMember.role !== MemberRole.ADMIN) {
        return ctx.json({ error: 'Unauthorized.' }, 401);
      }

      memberDoc.role = role;
      await memberDoc.save();

      return ctx.json({
        data: {
          $id: memberId,
          workspaceId,
        },
      });
    },
  );

export default app;
