// @ts-nocheck
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';

import { ATTACHMENTS_BUCKET, IMAGES_BUCKET } from '@/config/storage';
import { createCommentSchema } from '@/features/comments/schema';
import type { CommentDocument, CommentWithAuthor } from '@/features/comments/types';
import { type Member, type MemberDocument, MemberRole } from '@/features/members/types';
import { getMember } from '@/features/members/utils';
import type { Project } from '@/features/projects/types';
import { createTaskAttachmentSchema, createTaskSchema } from '@/features/tasks/schema';
import { type Task, TaskStatus, TaskType } from '@/features/tasks/types';
import { CommentModel, MemberModel, ProjectModel, TaskAttachmentModel, TaskModel, UserModel, connectToDatabase } from '@/lib/db';
import { toDocumentList } from '@/lib/db/format';
import { sessionMiddleware } from '@/lib/session-middleware';
import { storage } from '@/lib/storage';

const buildImageUrl = async (imageId?: string) => {
  if (!imageId) return undefined;

  const buffer = await storage.getFileView(IMAGES_BUCKET, imageId);
  return `data:image/png;base64,${buffer.toString('base64')}`;
};

const buildProjectMap = async (projectIds: string[]) => {
  if (!projectIds.length) return new Map<string, Project>();

  const projectDocs = await ProjectModel.find({ _id: { $in: projectIds } }).exec();

  const entries = await Promise.all(
    projectDocs.map(async (doc) => {
      const project = doc.toObject<Project>();
      const imageUrl = await buildImageUrl(project.imageId);

      return [project.$id, { ...project, imageUrl }] as const;
    }),
  );

  return new Map(entries);
};

const buildMemberMap = async (memberIds: string[]) => {
  if (!memberIds.length) return new Map<string, Member>();

  const memberDocs = await MemberModel.find({ _id: { $in: memberIds } }).exec();

  const userIds = memberDocs.map((doc) => doc.userId);
  const userDocs = await UserModel.find({ _id: { $in: userIds } }).exec();
  const userMap = new Map(userDocs.map((doc) => [doc._id.toString(), doc]));

  const entries = memberDocs.map((doc) => {
    const member = doc.toObject<MemberDocument>();
    const relatedUser = userMap.get(member.userId);

    return [
      member.$id,
      {
        ...member,
        name: relatedUser?.name ?? '',
        email: relatedUser?.email ?? '',
      },
    ] as const;
  });

  return new Map(entries);
};

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
        projectId: z.string().optional(),
        assigneeId: z.string().optional(),
        status: z.nativeEnum(TaskStatus).optional(),
        search: z.string().optional(),
        dueDate: z.string().optional(),
        type: z.nativeEnum(TaskType).optional(),
      }),
    ),
    async (ctx) => {
      const user = ctx.get('user');
      const { workspaceId, projectId, assigneeId, status, search, dueDate, type } = ctx.req.valid('query');

      const member = await getMember({ workspaceId, userId: user.$id });

      if (!member) {
        return ctx.json({ error: 'Unauthorized.' }, 401);
      }

      const filters: Record<string, unknown> = {
        workspaceId,
      };

      if (projectId) filters.projectId = projectId;
      if (status) filters.status = status;
      if (assigneeId) filters.assigneeId = assigneeId;
      if (dueDate) filters.dueDate = dueDate;
      if (type) filters.type = type;
      if (search) filters.name = { $regex: search, $options: 'i' };

      const taskDocs = await TaskModel.find(filters).sort({ createdAt: -1 }).exec();

      const projectIds = Array.from(new Set(taskDocs.map((doc) => doc.projectId)));
      const assigneeIds = Array.from(new Set(taskDocs.map((doc) => doc.assigneeId)));

      const [projectMap, memberMap] = await Promise.all([buildProjectMap(projectIds), buildMemberMap(assigneeIds)]);

      const tasks = taskDocs.map((doc) => {
        const task = doc.toObject<Task>();
        const project = projectMap.get(task.projectId);
        const assignee = memberMap.get(task.assigneeId);

        return {
          ...task,
          project,
          assignee,
        };
      });

      return ctx.json({ data: toDocumentList(tasks) });
    },
  )
  .get('/:taskId', sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const { taskId } = ctx.req.param();

    const taskDoc = await TaskModel.findById(taskId).exec();

    if (!taskDoc) {
      return ctx.json({ error: 'Task not found.' }, 404);
    }

    const task = taskDoc.toObject<Task>();

    const currentMember = await getMember({ workspaceId: task.workspaceId, userId: user.$id });

    if (!currentMember) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    const projectDoc = await ProjectModel.findById(task.projectId).exec();
    const memberDoc = await MemberModel.findById(task.assigneeId).exec();

    const project = projectDoc ? { ...projectDoc.toObject<Project>(), imageUrl: await buildImageUrl(projectDoc.imageId) } : undefined;

    let assignee: Member | undefined = undefined;

    if (memberDoc) {
      const memberData = memberDoc.toObject<MemberDocument>();
      const userDoc = await UserModel.findById(memberData.userId).exec();

      assignee = {
        ...memberData,
        name: userDoc?.name ?? '',
        email: userDoc?.email ?? '',
      };
    }

    return ctx.json({
      data: {
        ...task,
        project,
        assignee,
      },
    });
  })
  .post('/', sessionMiddleware, zValidator('json', createTaskSchema), async (ctx) => {
    const user = ctx.get('user');
    const { name, status, workspaceId, projectId, dueDate, assigneeId, type } = ctx.req.valid('json');

    const member = await getMember({ workspaceId, userId: user.$id });

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    const highestTask = await TaskModel.findOne({ workspaceId, status }).sort({ position: -1 }).exec();
    const position = highestTask ? highestTask.position + 1000 : 1000;

    const taskDoc = await TaskModel.create({
      name,
      status,
      workspaceId,
      projectId,
      dueDate: dueDate.toISOString(),
      type,
      assigneeId,
      position,
    });

    return ctx.json({ data: taskDoc.toObject<Task>() });
  })
  .patch('/:taskId', sessionMiddleware, zValidator('json', createTaskSchema.partial()), async (ctx) => {
    const user = ctx.get('user');
    const { taskId } = ctx.req.param();
    const payload = ctx.req.valid('json');

    const taskDoc = await TaskModel.findById(taskId).exec();

    if (!taskDoc) {
      return ctx.json({ error: 'Task not found.' }, 404);
    }

    const member = await getMember({ workspaceId: taskDoc.workspaceId, userId: user.$id });

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    if (payload.name) taskDoc.name = payload.name;
    if (payload.status) taskDoc.status = payload.status;
    if (payload.projectId) taskDoc.projectId = payload.projectId;
    if (payload.assigneeId) taskDoc.assigneeId = payload.assigneeId;
    if (payload.type) taskDoc.type = payload.type;
    if (payload.description !== undefined) taskDoc.description = payload.description;
    if (payload.dueDate) taskDoc.dueDate = payload.dueDate.toISOString();

    await taskDoc.save();

    return ctx.json({ data: taskDoc.toObject<Task>() });
  })
  .get('/:taskId/comments', sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const { taskId } = ctx.req.param();

    const taskDoc = await TaskModel.findById(taskId).exec();

    if (!taskDoc) {
      return ctx.json({ error: 'Task not found.' }, 404);
    }

    const member = await getMember({ workspaceId: taskDoc.workspaceId, userId: user.$id });

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    const commentsDocs = await CommentModel.find({ taskId }).sort({ createdAt: 1 }).exec();
    const memberIds = Array.from(new Set(commentsDocs.map((doc) => doc.memberId)));

    const memberMap = await buildMemberMap(memberIds);

    const comments: CommentWithAuthor[] = commentsDocs.map((doc) => {
      const comment = doc.toObject<CommentDocument>();
      const author = memberMap.get(comment.memberId);

      return {
        ...comment,
        mentions: comment.mentions ?? [],
        author,
      };
    });

    return ctx.json({ data: toDocumentList(comments) });
  })
  .post('/:taskId/comments', sessionMiddleware, zValidator('json', createCommentSchema), async (ctx) => {
    const user = ctx.get('user');
    const { taskId } = ctx.req.param();
    const { body, parentId, mentions } = ctx.req.valid('json');

    const taskDoc = await TaskModel.findById(taskId).exec();

    if (!taskDoc) {
      return ctx.json({ error: 'Task not found.' }, 404);
    }

    const member = await getMember({ workspaceId: taskDoc.workspaceId, userId: user.$id });

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    const commentDoc = await CommentModel.create({
      workspaceId: taskDoc.workspaceId,
      taskId,
      memberId: member.$id,
      body,
      parentId,
      mentions: mentions ?? [],
    });

    const userDoc = await UserModel.findById(member.userId).exec();

    return ctx.json({
      data: {
        ...commentDoc.toObject<CommentDocument>(),
        mentions: mentions ?? [],
        author: {
          ...member,
          name: userDoc?.name ?? '',
          email: userDoc?.email ?? '',
        },
      },
    });
  })
  .get('/:taskId/attachments', sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const { taskId } = ctx.req.param();

    const taskDoc = await TaskModel.findById(taskId).exec();

    if (!taskDoc) {
      return ctx.json({ error: 'Task not found.' }, 404);
    }

    const member = await getMember({ workspaceId: taskDoc.workspaceId, userId: user.$id });

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    const attachmentDocs = await TaskAttachmentModel.find({ taskId }).sort({ createdAt: -1 }).exec();
    const uploaderIds = Array.from(new Set(attachmentDocs.map((doc) => doc.memberId)));
    const memberMap = await buildMemberMap(uploaderIds);

    const attachments = attachmentDocs.map((doc) => {
      const attachment = doc.toObject();
      const uploader = memberMap.get(attachment.memberId);

      return {
        ...attachment,
        uploader,
      };
    });

    return ctx.json({ data: toDocumentList(attachments) });
  })
  .post('/:taskId/attachments', sessionMiddleware, zValidator('form', createTaskAttachmentSchema), async (ctx) => {
    const user = ctx.get('user');
    const { taskId } = ctx.req.param();
    const { file } = ctx.req.valid('form');

    const taskDoc = await TaskModel.findById(taskId).exec();

    if (!taskDoc) {
      return ctx.json({ error: 'Task not found.' }, 404);
    }

    const member = await getMember({ workspaceId: taskDoc.workspaceId, userId: user.$id });

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    const fileId = randomUUID();
    await storage.createFile(ATTACHMENTS_BUCKET, fileId, file);

    const attachmentDoc = await TaskAttachmentModel.create({
      taskId,
      workspaceId: taskDoc.workspaceId,
      memberId: member.$id,
      fileId,
      name: file.name,
      size: file.size,
      mimeType: file.type || 'application/octet-stream',
    });

    const memberMap = await buildMemberMap([member.$id]);

    return ctx.json({
      data: {
        ...attachmentDoc.toObject(),
        uploader: memberMap.get(member.$id),
      },
    });
  })
  .get('/:taskId/attachments/:attachmentId/download', sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const { taskId, attachmentId } = ctx.req.param();

    const attachmentDoc = await TaskAttachmentModel.findById(attachmentId).exec();

    if (!attachmentDoc || attachmentDoc.taskId !== taskId) {
      return ctx.json({ error: 'Attachment not found.' }, 404);
    }

    const member = await getMember({ workspaceId: attachmentDoc.workspaceId, userId: user.$id });

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    const fileBuffer = await storage.getFileView(ATTACHMENTS_BUCKET, attachmentDoc.fileId);

    return new Response(fileBuffer, {
      headers: {
        'Content-Type': attachmentDoc.mimeType,
        'Content-Length': attachmentDoc.size.toString(),
        'Content-Disposition': `attachment; filename="${encodeURIComponent(attachmentDoc.name)}"`,
      },
    });
  })
  .delete('/:taskId/attachments/:attachmentId', sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const { taskId, attachmentId } = ctx.req.param();

    const attachmentDoc = await TaskAttachmentModel.findById(attachmentId).exec();

    if (!attachmentDoc || attachmentDoc.taskId !== taskId) {
      return ctx.json({ error: 'Attachment not found.' }, 404);
    }

    const member = await getMember({ workspaceId: attachmentDoc.workspaceId, userId: user.$id });

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    if (member.role !== MemberRole.ADMIN && attachmentDoc.memberId !== member.$id) {
      return ctx.json({ error: 'Forbidden.' }, 403);
    }

    await storage.deleteFile(ATTACHMENTS_BUCKET, attachmentDoc.fileId);
    await attachmentDoc.deleteOne();

    return ctx.json({ data: { deleted: true } });
  })
  .delete('/:taskId/comments/:commentId', sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const { taskId, commentId } = ctx.req.param();

    const taskDoc = await TaskModel.findById(taskId).exec();

    if (!taskDoc) {
      return ctx.json({ error: 'Task not found.' }, 404);
    }

    const member = await getMember({ workspaceId: taskDoc.workspaceId, userId: user.$id });

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    const commentDoc = await CommentModel.findById(commentId).exec();

    if (!commentDoc || commentDoc.taskId !== taskId) {
      return ctx.json({ error: 'Comment not found.' }, 404);
    }

    if (commentDoc.memberId !== member.$id && member.role !== MemberRole.ADMIN) {
      return ctx.json({ error: 'Forbidden.' }, 403);
    }

    const comments = await CommentModel.find({ taskId }).select('_id parentId').lean();
    const childMap = comments.reduce<Map<string, string[]>>((map, comment) => {
      if (!comment.parentId) return map;
      const parentId = comment.parentId.toString();
      if (!map.has(parentId)) {
        map.set(parentId, []);
      }
      map.get(parentId)!.push(comment._id.toString());
      return map;
    }, new Map());

    const idsToDelete = new Set<string>([commentId]);
    const queue = [commentId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const children = childMap.get(currentId) ?? [];

      children.forEach((childId) => {
        if (!idsToDelete.has(childId)) {
          idsToDelete.add(childId);
          queue.push(childId);
        }
      });
    }

    await CommentModel.deleteMany({ _id: { $in: Array.from(idsToDelete) } });

    return ctx.json({
      data: {
        deletedIds: Array.from(idsToDelete),
      },
    });
  })
  .post(
    '/bulk-update',
    sessionMiddleware,
    zValidator(
      'json',
      z.object({
        tasks: z.array(
          z.object({
            $id: z.string(),
            status: z.nativeEnum(TaskStatus),
            position: z.number().int().positive().min(1000).max(100000),
          }),
        ),
      }),
    ),
    async (ctx) => {
      const user = ctx.get('user');
      const { tasks } = ctx.req.valid('json');

      const taskDocs = await TaskModel.find({ _id: { $in: tasks.map((task) => task.$id) } }).exec();

      if (!taskDocs.length) {
        return ctx.json({ error: 'Tasks not found.' }, 404);
      }

      const workspaceIds = Array.from(new Set(taskDocs.map((task) => task.workspaceId)));

      if (workspaceIds.length !== 1) {
        return ctx.json({ error: 'All tasks must belong to the same workspace.' }, 401);
      }

      const workspaceId = workspaceIds[0];

      const member = await getMember({ workspaceId, userId: user.$id });

      if (!member) {
        return ctx.json({ error: 'Unauthorized.' }, 401);
      }

      const updatedTasks = await Promise.all(
        tasks.map(async ({ $id, status, position }) => {
          const updatedTask = await TaskModel.findByIdAndUpdate(
            $id,
            {
              status,
              position,
            },
            {
              new: true,
            },
          ).exec();

          return updatedTask ? updatedTask.toObject<Task>() : null;
        }),
      );

      return ctx.json({
        data: {
          updatedTasks: updatedTasks.filter(Boolean),
          workspaceId,
        },
      });
    },
  )
  .delete('/:taskId', sessionMiddleware, async (ctx) => {
    const user = ctx.get('user');
    const { taskId } = ctx.req.param();

    const taskDoc = await TaskModel.findById(taskId).exec();

    if (!taskDoc) {
      return ctx.json({ error: 'Task not found.' }, 404);
    }

    const member = await getMember({ workspaceId: taskDoc.workspaceId, userId: user.$id });

    if (!member) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    await TaskModel.findByIdAndDelete(taskId);
    await CommentModel.deleteMany({ taskId });

    return ctx.json({ data: { $id: taskId, workspaceId: taskDoc.workspaceId } });
  });

export default app;
