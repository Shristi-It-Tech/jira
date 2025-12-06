import mongoose from 'mongoose';

declare global {
  // eslint-disable-next-line no-var
  var mongooseConnection:
    | {
        promise: Promise<typeof mongoose> | null;
        conn: typeof mongoose | null;
      }
    | undefined;
}

const getGlobalConnection = () => {
  if (!globalThis.mongooseConnection) {
    globalThis.mongooseConnection = {
      promise: null,
      conn: null,
    };
  }

  return globalThis.mongooseConnection;
};

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB ?? 'jira-clone';

export const connectToDatabase = async () => {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set.');
  }

  const cache = getGlobalConnection();

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB,
    });
  }

  cache.conn = await cache.promise;

  return cache.conn;
};
