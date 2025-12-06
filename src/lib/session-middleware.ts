import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';

import { AUTH_COOKIE } from '@/features/auth/constants';
import { UserModel, connectToDatabase } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

type SessionUser = {
  $id: string;
  name: string;
  email: string;
};

type AdditionalContext = {
  Variables: {
    user: SessionUser;
  };
};

export const sessionMiddleware = createMiddleware<AdditionalContext>(async (ctx, next) => {
  const token = getCookie(ctx, AUTH_COOKIE);

  if (!token) {
    return ctx.json({ error: 'Unauthorized.' }, 401);
  }

  try {
    const payload = verifyToken(token);
    await connectToDatabase();

    const user = await UserModel.findById(payload.userId).lean();

    if (!user) {
      return ctx.json({ error: 'Unauthorized.' }, 401);
    }

    ctx.set('user', {
      $id: user._id.toString(),
      name: user.name,
      email: user.email,
    });

    return await next();
  } catch (error) {
    console.error(error);
    return ctx.json({ error: 'Unauthorized.' }, 401);
  }
});
