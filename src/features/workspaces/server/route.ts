// @ts-nocheck
import { zValidator } from '@hono/zod-validator';
import { endOfMonth, startOfMonth, subMonths } from 'date-fns';
import { Hono } from 'hono';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';

import { IMAGES_BUCKET } from '@/config/storage';
import { MemberRole } from '@/features/members/types';
import { getMember } from '@/features/members/utils';
import { TaskStatus } from '@/features/tasks/types';
import { createWorkspaceSchema, updateWorkspaceSchema } from '@/features/workspaces/schema';
import type { Workspace } from '@/features/workspaces/types';
import { EmployeeModel, MemberModel, ProjectModel, TaskModel, WorkspaceModel, connectToDatabase } from '@/lib/db';
import { toDocumentList } from '@/lib/db/format';
import { sessionMiddleware } from '@/lib/session-middleware';
import { storage } from '@/lib/storage';
import { generateInviteCode } from '@/lib/utils';

const buildImageUrl = async (imageId?: string) => {
  if (!imageId) return undefined;

  const buffer = await storage.getFileView(IMAGES_BUCKET, imageId);
  return `data:image/png;base64,${buffer.toString('base64')}`;
};

const withImage = async <T extends { imageId?: string }>(entity: T) => {
  const imageUrl = await buildImageUrl(entity.imageId);
  return { ...entity, imageUrl };
};

const persistImage = async (image?: File | string, currentImageId?: string) => {
  if (!image) return currentImageId;

  if (image instanceof File) {
    const fileId = randomUUID();

    await storage.createFile(IMAGES_BUCKET, fileId, image);

    if (currentImageId) {
      await storage.deleteFile(IMAGES_BUCKET, currentImageId);
    }

    return fileId;
  }

  return image;
};

const app = new Hono()
  .use(async (_ctx, next) => {
    await connectToDatabase();
    return next();
  })
  .get('/', sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');

    const memberships = await MemberModel.find({ userId: user.$id }).exec();

    if (!memberships.length) {
      return ctx.json({ data: toDocumentList<Workspace>([]) });
    }

    const workspaceIds = memberships.map((member) => member.workspaceId);
    const workspaceDocs = await WorkspaceModel.find({ _id: { $in: workspaceIds } })
      .sort({ createdAt: -1 })
      .exec();

    const workspaces = await Promise.all(
      workspaceDocs.map(async (doc) => {
        const workspace = doc.toObject<Workspace>();
        return withImage(workspace);
      }),
    );

    return ctx.json({ data: toDocumentList(workspaces) });
  })
  .post('/', zValidator('form', createWorkspaceSchema), sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const { name, image } = ctx.req.valid('form');

    const [memberships, adminMembership] = await Promise.all([
      MemberModel.find({ userId: user.$id }).select('_id role workspaceId').lean(),
      MemberModel.findOne({ userId: user.$id, role: MemberRole.ADMIN }).select('_id').lean(),
    ]);

    if (memberships.length > 0 && !adminMembership) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    const normalizedImage = typeof image === 'string' && image.length === 0 ? undefined : image;
    const imageId = await persistImage(normalizedImage ?? undefined);

    const workspaceDoc = await WorkspaceModel.create({
      name,
      userId: user.$id,
      imageId,
      inviteCode: generateInviteCode(6),
    });

    const workspace = workspaceDoc.toObject<Workspace>();

    await MemberModel.create({
      userId: user.$id,
      workspaceId: workspace.$id,
      role: MemberRole.ADMIN,
    });

    return ctx.json({ data: workspace });
  })
  .get('/:workspaceId', sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const { workspaceId } = ctx.req.param();

    const workspaceDoc = await WorkspaceModel.findById(workspaceId).exec();

    if (!workspaceDoc) {
      return ctx.json({ error: 'Workspace not found.' }, 404);
    }

    const member = await getMember({ workspaceId, userId: user.$id });

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    const workspace = workspaceDoc.toObject<Workspace>();
    const workspaceWithImage = await withImage(workspace);

    return ctx.json({ data: workspaceWithImage });
  })
  .get('/:workspaceId/info', sessionMiddleware, async (ctx) => {
    const { workspaceId } = ctx.req.param();

    const workspaceDoc = await WorkspaceModel.findById(workspaceId).exec();

    if (!workspaceDoc) {
      return ctx.json({ error: 'Workspace not found.' }, 404);
    }

    const workspace = workspaceDoc.toObject<Workspace>();

    return ctx.json({
      data: {
        $id: workspace.$id,
        name: workspace.name,
      },
    });
  })
  .patch('/:workspaceId', sessionMiddleware, zValidator('form', updateWorkspaceSchema), async (ctx) => {
    const user = ctx.get('user');
    const { workspaceId } = ctx.req.param();
    const { name, image } = ctx.req.valid('form');

    const workspaceDoc = await WorkspaceModel.findById(workspaceId).exec();

    if (!workspaceDoc) {
      return ctx.json({ error: 'Workspace not found.' }, 404);
    }

    const member = await getMember({ workspaceId, userId: user.$id });

    if (!member || member.role !== MemberRole.ADMIN) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    const normalizedImage = typeof image === 'string' && image.length === 0 ? undefined : image;

    const imageId = await persistImage(normalizedImage, workspaceDoc.imageId);

    workspaceDoc.name = name ?? workspaceDoc.name;
    workspaceDoc.imageId = imageId;

    await workspaceDoc.save();

    const workspace = workspaceDoc.toObject<Workspace>();

    return ctx.json({ data: workspace });
  })
  .delete('/:workspaceId', sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const { workspaceId } = ctx.req.param();

    const workspaceDoc = await WorkspaceModel.findById(workspaceId).exec();

    if (!workspaceDoc) {
      return ctx.json({ error: 'Workspace not found.' }, 404);
    }

    const member = await getMember({ workspaceId, userId: user.$id });

    if (!member || member.role !== MemberRole.ADMIN) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    const projects = await ProjectModel.find({ workspaceId }).exec();

    for (const project of projects) {
      if (project.imageId) {
        await storage.deleteFile(IMAGES_BUCKET, project.imageId);
      }
    }

    await MemberModel.deleteMany({ workspaceId });
    await ProjectModel.deleteMany({ workspaceId });
    await TaskModel.deleteMany({ workspaceId });
    await EmployeeModel.deleteMany({ workspaceId });

    if (workspaceDoc.imageId) {
      await storage.deleteFile(IMAGES_BUCKET, workspaceDoc.imageId);
    }

    await WorkspaceModel.findByIdAndDelete(workspaceId);

    return ctx.json({ data: { $id: workspaceId } });
  })
  .post('/:workspaceId/resetInviteCode', sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const { workspaceId } = ctx.req.param();

    const member = await getMember({ workspaceId, userId: user.$id });

    if (!member || member.role !== MemberRole.ADMIN) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    const workspaceDoc = await WorkspaceModel.findById(workspaceId).exec();

    if (!workspaceDoc) {
      return ctx.json({ error: 'Workspace not found.' }, 404);
    }

    workspaceDoc.inviteCode = generateInviteCode(6);
    await workspaceDoc.save();

    return ctx.json({ data: workspaceDoc.toObject<Workspace>() });
  })
  .post(
    '/:workspaceId/join',
    sessionMiddleware,
    zValidator(
      'json',
      z.object({
        code: z.string(),
      }),
    ),
    async (ctx) => {
      const user = ctx.get('user');
      const { workspaceId } = ctx.req.param();
      const { code } = ctx.req.valid('json');

      const workspaceDoc = await WorkspaceModel.findById(workspaceId).exec();

      if (!workspaceDoc) {
        return ctx.json({ error: 'Workspace not found.' }, 404);
      }

      const existingMember = await getMember({ workspaceId, userId: user.$id });

      if (existingMember) {
        return ctx.json({ error: 'Already a member.' }, 400);
      }

      if (workspaceDoc.inviteCode !== code) {
        return ctx.json({ error: 'Invalid invite code.' }, 400);
      }

      await MemberModel.create({
        workspaceId,
        userId: user.$id,
        role: MemberRole.MEMBER,
      });

      return ctx.json({ data: workspaceDoc.toObject<Workspace>() });
    },
  )
  .get('/:workspaceId/analytics', sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const { workspaceId } = ctx.req.param();

    const member = await getMember({ workspaceId, userId: user.$id });

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const taskCount = await TaskModel.countDocuments({
      workspaceId,
      createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd },
    });

    const lastMonthTaskCount = await TaskModel.countDocuments({
      workspaceId,
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
    });

    const assignedTaskCount = await TaskModel.countDocuments({
      workspaceId,
      assigneeId: member.$id,
      createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd },
    });

    const lastMonthAssignedTaskCount = await TaskModel.countDocuments({
      workspaceId,
      assigneeId: member.$id,
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
    });

    const incompleteTaskCount = await TaskModel.countDocuments({
      workspaceId,
      status: { $ne: TaskStatus.DONE },
      createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd },
    });

    const lastMonthIncompleteTaskCount = await TaskModel.countDocuments({
      workspaceId,
      status: { $ne: TaskStatus.DONE },
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
    });

    const completedTaskCount = await TaskModel.countDocuments({
      workspaceId,
      status: TaskStatus.DONE,
      createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd },
    });

    const lastMonthCompletedTaskCount = await TaskModel.countDocuments({
      workspaceId,
      status: TaskStatus.DONE,
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
    });

    const overdueTaskCount = await TaskModel.countDocuments({
      workspaceId,
      status: { $ne: TaskStatus.DONE },
      dueDate: { $lt: now.toISOString() },
      createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd },
    });

    const lastMonthOverdueTaskCount = await TaskModel.countDocuments({
      workspaceId,
      status: { $ne: TaskStatus.DONE },
      dueDate: { $lt: now.toISOString() },
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
    });

    return ctx.json({
      data: {
        taskCount,
        taskDifference: taskCount - lastMonthTaskCount,
        assignedTaskCount,
        assignedTaskDifference: assignedTaskCount - lastMonthAssignedTaskCount,
        completedTaskCount,
        completedTaskDifference: completedTaskCount - lastMonthCompletedTaskCount,
        incompleteTaskCount,
        incompleteTaskDifference: incompleteTaskCount - lastMonthIncompleteTaskCount,
        overdueTaskCount,
        overdueTaskDifference: overdueTaskCount - lastMonthOverdueTaskCount,
      },
    });
  });

export default app;
