// @ts-nocheck
import { zValidator } from '@hono/zod-validator';
import { endOfMonth, startOfMonth, subMonths } from 'date-fns';
import { Hono } from 'hono';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';

import { IMAGES_BUCKET } from '@/config/storage';
import { getMember } from '@/features/members/utils';
import { createProjectSchema, updateProjectSchema } from '@/features/projects/schema';
import type { Project } from '@/features/projects/types';
import { TaskStatus } from '@/features/tasks/types';
import { ProjectModel, TaskModel, connectToDatabase } from '@/lib/db';
import { sessionMiddleware } from '@/lib/session-middleware';
import { storage } from '@/lib/storage';

const buildImageUrl = async (imageId?: string) => {
  if (!imageId) return undefined;

  const buffer = await storage.getFileView(IMAGES_BUCKET, imageId);
  return `data:image/png;base64,${buffer.toString('base64')}`;
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
  .post('/', sessionMiddleware, zValidator('form', createProjectSchema), async (ctx) => {
    const user = ctx.get('user');
    const { name, image, workspaceId } = ctx.req.valid('form');

    const member = await getMember({ workspaceId, userId: user.$id });

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    const normalizedImage = typeof image === 'string' && image.length === 0 ? undefined : image;
    const imageId = await persistImage(normalizedImage);

    const projectDoc = await ProjectModel.create({
      name,
      imageId,
      workspaceId,
    });

    const project = projectDoc.toObject<Project>();

    return ctx.json({ data: project });
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

      const projectDocs = await ProjectModel.find({ workspaceId }).sort({ createdAt: -1 }).exec();

      const projects = await Promise.all(
        projectDocs.map(async (doc) => {
          const project = doc.toObject<Project>();
          const imageUrl = await buildImageUrl(project.imageId);
          return { ...project, imageUrl };
        }),
      );

      return ctx.json({
        data: {
          documents: projects,
          total: projects.length,
        },
      });
    },
  )
  .get('/:projectId', sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const { projectId } = ctx.req.param();

    const projectDoc = await ProjectModel.findById(projectId).exec();

    if (!projectDoc) {
      return ctx.json({ error: 'Project not found.' }, 404);
    }

    const project = projectDoc.toObject<Project>();
    const member = await getMember({ workspaceId: project.workspaceId, userId: user.$id });

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    const imageUrl = await buildImageUrl(project.imageId);

    return ctx.json({ data: { ...project, imageUrl } });
  })
  .patch('/:projectId', sessionMiddleware, zValidator('form', updateProjectSchema), async (ctx) => {
    const user = ctx.get('user');
    const { projectId } = ctx.req.param();
    const { name, image } = ctx.req.valid('form');

    const projectDoc = await ProjectModel.findById(projectId).exec();

    if (!projectDoc) {
      return ctx.json({ error: 'Project not found.' }, 404);
    }

    const member = await getMember({ workspaceId: projectDoc.workspaceId, userId: user.$id });

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    const normalizedImage = typeof image === 'string' && image.length === 0 ? undefined : image;
    const imageId = await persistImage(normalizedImage, projectDoc.imageId);

    projectDoc.name = name ?? projectDoc.name;
    projectDoc.imageId = imageId;

    await projectDoc.save();

    const project = projectDoc.toObject<Project>();

    return ctx.json({ data: project });
  })
  .delete('/:projectId', sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const { projectId } = ctx.req.param();

    const projectDoc = await ProjectModel.findById(projectId).exec();

    if (!projectDoc) {
      return ctx.json({ error: 'Project not found.' }, 404);
    }

    const member = await getMember({ workspaceId: projectDoc.workspaceId, userId: user.$id });

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    await TaskModel.deleteMany({ projectId });

    if (projectDoc.imageId) {
      await storage.deleteFile(IMAGES_BUCKET, projectDoc.imageId);
    }

    await ProjectModel.findByIdAndDelete(projectId);

    return ctx.json({
      data: {
        $id: projectId,
        workspaceId: projectDoc.workspaceId,
      },
    });
  })
  .get('/:projectId/analytics', sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const { projectId } = ctx.req.param();

    const projectDoc = await ProjectModel.findById(projectId).exec();

    if (!projectDoc) {
      return ctx.json({ error: 'Project not found.' }, 404);
    }

    const member = await getMember({ workspaceId: projectDoc.workspaceId, userId: user.$id });

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const buildFilter = (overrides: Record<string, unknown>) => ({
      projectId,
      ...overrides,
    });

    const taskCount = await TaskModel.countDocuments(
      buildFilter({
        createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd },
      }),
    );

    const lastMonthTaskCount = await TaskModel.countDocuments(
      buildFilter({
        createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
      }),
    );

    const assignedTaskCount = await TaskModel.countDocuments(
      buildFilter({
        assigneeId: member.$id,
        createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd },
      }),
    );

    const lastMonthAssignedTaskCount = await TaskModel.countDocuments(
      buildFilter({
        assigneeId: member.$id,
        createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
      }),
    );

    const incompleteTaskCount = await TaskModel.countDocuments(
      buildFilter({
        status: { $ne: TaskStatus.DONE },
        createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd },
      }),
    );

    const lastMonthIncompleteTaskCount = await TaskModel.countDocuments(
      buildFilter({
        status: { $ne: TaskStatus.DONE },
        createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
      }),
    );

    const completedTaskCount = await TaskModel.countDocuments(
      buildFilter({
        status: TaskStatus.DONE,
        createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd },
      }),
    );

    const lastMonthCompletedTaskCount = await TaskModel.countDocuments(
      buildFilter({
        status: TaskStatus.DONE,
        createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
      }),
    );

    const overdueTaskCount = await TaskModel.countDocuments(
      buildFilter({
        status: { $ne: TaskStatus.DONE },
        dueDate: { $lt: now.toISOString() },
        createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd },
      }),
    );

    const lastMonthOverdueTaskCount = await TaskModel.countDocuments(
      buildFilter({
        status: { $ne: TaskStatus.DONE },
        dueDate: { $lt: now.toISOString() },
        createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
      }),
    );

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
