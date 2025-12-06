## Environment Configuration

Copy `.env.local` and adjust the values to match your local environment:

```env
# disable next.js telemetry
NEXT_TELEMETRY_DISABLED=1

# base url for the app
NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000

# database
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=jira-clone

# jwt auth
JWT_SECRET=replace-with-a-secure-random-string
JWT_EXPIRES_IN=30d

# optional file storage location
FILE_STORAGE_ROOT=./public/uploads
```

`FILE_STORAGE_ROOT` defaults to `./public/uploads` if omitted. Make sure MongoDB is running locally (or update `MONGODB_URI` to point to your cluster) before starting the app.

## Getting Started

1. Install dependencies
   ```bash
   npm install
   ```
2. Start the dev server
   ```bash
   npm run dev
   ```

The API now uses MongoDB for persistence and issues signed JWT cookies for authentication, so no Appwrite project or OAuth setup is required.
