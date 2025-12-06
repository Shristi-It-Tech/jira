import jwt from 'jsonwebtoken';

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '30d';

type TokenPayload = {
  userId: string;
};

const getSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not set.');
  }

  return secret;
};

export const signToken = (payload: TokenPayload, expiresIn = JWT_EXPIRES_IN) => {
  return jwt.sign(payload, getSecret(), {
    expiresIn,
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, getSecret()) as TokenPayload;
};
