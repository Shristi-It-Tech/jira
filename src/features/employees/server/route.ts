// @ts-nocheck
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

import { createEmployeeSchema, updateEmployeeSchema } from '@/features/employees/schema';
import type { Employee } from '@/features/employees/types';
import { MemberRole } from '@/features/members/types';
import { getMember } from '@/features/members/utils';
import { EmployeeModel, connectToDatabase } from '@/lib/db';
import { sessionMiddleware } from '@/lib/session-middleware';

const workspaceQuerySchema = z.object({
  workspaceId: z.string(),
});

const app = new Hono()
  .use(async (_ctx, next) => {
    await connectToDatabase();
    return next();
  })
  .get('/', sessionMiddleware, zValidator('query', workspaceQuerySchema), async (ctx) => {
    const user = ctx.get('user');
    const { workspaceId } = ctx.req.valid('query');

    const member = await getMember({ workspaceId, userId: user.$id });

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    const employeeDocs = await EmployeeModel.find({ workspaceId }).sort({ createdAt: -1 }).exec();
    const employees = employeeDocs.map((doc) => doc.toObject<Employee>());

    return ctx.json({
      data: {
        documents: employees,
        total: employees.length,
      },
    });
  })
  .get('/:employeeId', sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const { employeeId } = ctx.req.param();

    const employeeDoc = await EmployeeModel.findById(employeeId).exec();

    if (!employeeDoc) {
      return ctx.json({ error: 'Employee not found.' }, 404);
    }

    const member = await getMember({ workspaceId: employeeDoc.workspaceId, userId: user.$id });

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    return ctx.json({ data: employeeDoc.toObject<Employee>() });
  })
  .post('/', sessionMiddleware, zValidator('json', createEmployeeSchema), async (ctx) => {
    const user = ctx.get('user');
    const payload = ctx.req.valid('json');

    const member = await getMember({ workspaceId: payload.workspaceId, userId: user.$id });

    if (!member || member.role !== MemberRole.ADMIN) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    const employeeDoc = await EmployeeModel.create({
      ...payload,
      startDate: payload.startDate.toISOString(),
    });

    return ctx.json({ data: employeeDoc.toObject<Employee>() });
  })
  .patch('/:employeeId', sessionMiddleware, zValidator('json', updateEmployeeSchema), async (ctx) => {
    const user = ctx.get('user');
    const { employeeId } = ctx.req.param();
    const updates = ctx.req.valid('json');

    const employeeDoc = await EmployeeModel.findById(employeeId).exec();

    if (!employeeDoc) {
      return ctx.json({ error: 'Employee not found.' }, 404);
    }

    const member = await getMember({ workspaceId: employeeDoc.workspaceId, userId: user.$id });

    if (!member || member.role !== MemberRole.ADMIN) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    Object.assign(employeeDoc, updates, {
      startDate: updates.startDate ? updates.startDate.toISOString() : employeeDoc.startDate,
    });

    await employeeDoc.save();

    return ctx.json({ data: employeeDoc.toObject<Employee>() });
  })
  .delete('/:employeeId', sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const { employeeId } = ctx.req.param();

    const employeeDoc = await EmployeeModel.findById(employeeId).exec();

    if (!employeeDoc) {
      return ctx.json({ error: 'Employee not found.' }, 404);
    }

    const member = await getMember({ workspaceId: employeeDoc.workspaceId, userId: user.$id });

    if (!member || member.role !== MemberRole.ADMIN) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    await EmployeeModel.findByIdAndDelete(employeeId);

    return ctx.json({ data: { $id: employeeId } });
  });

export default app;
