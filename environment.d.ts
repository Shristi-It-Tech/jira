// This file is needed to support autocomplete for process.env
export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // app base url
      NEXT_PUBLIC_APP_BASE_URL: string;

      // database
      MONGODB_URI: string;
      MONGODB_DB?: string;

      // auth
      JWT_SECRET: string;
      JWT_EXPIRES_IN?: string;

      // file storage
      FILE_STORAGE_ROOT?: string;
    }
  }
}
