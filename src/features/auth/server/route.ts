import { zValidator } from '@hono/zod-validator';
import bcrypt from 'bcryptjs';
import { Hono } from 'hono';
import { deleteCookie, setCookie } from 'hono/cookie';

import { AUTH_COOKIE } from '@/features/auth/constants';
import { signInFormSchema, signUpFormSchema } from '@/features/auth/schema';
import { UserModel, connectToDatabase } from '@/lib/db';
import { signToken } from '@/lib/jwt';
import { sessionMiddleware } from '@/lib/session-middleware';

const COOKIE_OPTIONS = {
  path: '/',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 60 * 60 * 24 * 30,
};

const app = new Hono()
  .get('/current', sessionMiddleware, async (ctx) => {
    await connectToDatabase();
    const user = ctx.get('user');

    const dbUser = await UserModel.findById(user.$id).lean();

    if (!dbUser) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    return ctx.json({
      data: {
        $id: user.$id,
        name: dbUser.name,
        email: dbUser.email,
      },
    });
  })
  .post('/login', zValidator('json', signInFormSchema), async (ctx) => {
    const { email, password } = ctx.req.valid('json');

    await connectToDatabase();

    const user = await UserModel.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return ctx.json({ error: 'Invalid credentials.' }, 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return ctx.json({ error: 'Invalid credentials.' }, 401);
    }

    const token = signToken({ userId: user._id.toString() });

    setCookie(ctx, AUTH_COOKIE, token, COOKIE_OPTIONS);

    return ctx.json({ success: true });
  })
  .post('/register', zValidator('json', signUpFormSchema), async (ctx) => {
    const { name, email, password } = ctx.req.valid('json');

    await connectToDatabase();

    const existingUser = await UserModel.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return ctx.json({ error: 'Email already in use.' }, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const token = signToken({ userId: user._id.toString() });

    setCookie(ctx, AUTH_COOKIE, token, COOKIE_OPTIONS);

    return ctx.json({ success: true });
  })
  .post('/logout', sessionMiddleware, async (ctx) => {
    deleteCookie(ctx, AUTH_COOKIE, COOKIE_OPTIONS);

    return ctx.json({ success: true });
  });

export default app;
