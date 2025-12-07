// @ts-nocheck
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

import { getMember } from '@/features/members/utils';
import { createSprintSchema, updateSprintSchema } from '@/features/sprints/schema';
import type { Sprint } from '@/features/sprints/types';
import { SprintStatus } from '@/features/sprints/types';
import { SprintModel, connectToDatabase } from '@/lib/db';
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

      const sprintDocs = await SprintModel.find({ workspaceId }).sort({ startDate: 1 }).exec();
      const sprints = sprintDocs.map((doc) => doc.toObject<Sprint>());

      return ctx.json({
        data: {
          documents: sprints,
          total: sprints.length,
        },
      });
    },
  )
  .post('/', sessionMiddleware, zValidator('json', createSprintSchema), async (ctx) => {
    const user = ctx.get('user');
    const { workspaceId, name, startDate, endDate, status } = ctx.req.valid('json');

    const member = await getMember({ workspaceId, userId: user.$id });

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    const sprintDoc = await SprintModel.create({
      workspaceId,
      name,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: status ?? SprintStatus.CLOSED,
    });

    return ctx.json({ data: sprintDoc.toObject<Sprint>() });
  })
  .patch('/:sprintId', sessionMiddleware, zValidator('json', updateSprintSchema), async (ctx) => {
    const user = ctx.get('user');
    const { sprintId } = ctx.req.param();
    const { name, startDate, endDate, status } = ctx.req.valid('json');

    const sprintDoc = await SprintModel.findById(sprintId).exec();

    if (!sprintDoc) {
      return ctx.json({ error: 'Sprint not found.' }, 404);
    }

    const member = await getMember({ workspaceId: sprintDoc.workspaceId, userId: user.$id });

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    sprintDoc.name = name;
    sprintDoc.startDate = startDate.toISOString();
    sprintDoc.endDate = endDate.toISOString();
    if (status) {
      sprintDoc.status = status;
    }

    await sprintDoc.save();

    return ctx.json({ data: sprintDoc.toObject<Sprint>() });
  });

export default app;
