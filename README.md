```env
# .env.local

# disable next.js telemetry
NEXT_TELEMETRY_DISABLED=1

# app base url
NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000

# appwrite project and key
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=6934120c0004741a9572
NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID=693416eb0022cd82a704
NEXT_APPWRITE_KEY=standard_a416d84ebad0430844ce954eb6df2fabe90ec6792cfac0ae0579f4bc9efbd9f690432d9244cf39bed980ddf196501cf52caa139a620df5c29692f5317bf9506165230c3fe6a56788674a1a05f95e94b033038a63289a3d42818d3075a02d2407e3c851e2b38aa5586d034042bf2282e9df87139c98a5b89f28d4eccaadefc5e8

# appwrite database ids
NEXT_PUBLIC_APPWRITE_DATABASE_ID=693413b20004d848646d
NEXT_PUBLIC_APPWRITE_MEMBERS_ID=members
NEXT_PUBLIC_APPWRITE_PROJECTS_ID=projects
NEXT_PUBLIC_APPWRITE_TASKS_ID=tasks
NEXT_PUBLIC_APPWRITE_WORKSPACES_ID=workspaces

```

### 5. Disable Next.js Telemetry

Set `NEXT_TELEMETRY_DISABLED` to `1`. This disables Next.js telemetry (optional).

### 6. App Base URL

Set the `NEXT_PUBLIC_APP_BASE_URL` to `http://localhost:3000` where your app will be running locally or in production.

### 7. Get Appwrite Endpoint and Project ID

1. Create an account on **[Appwrite](https://appwrite.io/)**.
2. **Create a new project**:
   - Go to **Dashboard** > **Create Project**.
3. Retrieve your **Appwrite Endpoint** and **Project ID**:
   - Navigate to **Settings** > **Overview** > **API Credentials**.
   - Copy the **Endpoint** and **Project ID**, and save them in `.env.local` as `NEXT_PUBLIC_APPWRITE_ENDPOINT` and `NEXT_PUBLIC_APPWRITE_PROJECT`.

---

### 8. Generate Appwrite API Key

1. Go to the **Overview** tab.
2. Navigate to **Integrations** > **API Keys** > **Create API Key**:
   - Name: `jira-clone-web` (or any preferred name).
   - Expiration Time: **Never**.
   - Scopes:
     - `auth`
     - `session.write`
     - `users.read`.
3. Copy the generated API key and save it in `.env.local` as `NEXT_APPWRITE_KEY`.

---

### 9. Create Database and Collections

#### Create the Database

1. Go to the **Databases** tab.
2. Create a new database named `jira-clone`.
3. Copy the **Database ID** (displayed near the database name) and save it in `.env.local` as `NEXT_PUBLIC_APPWRITE_DATABASE_ID`.

---

#### Create Collections and Define Attributes

1. **Tasks** Collection:

- Attributes:
  - `workspaceId` (String, Required, Size: 50)
  - `name` (String, Required, Size: 256)
  - `projectId` (String, Required, Size: 50)
  - `assigneeId` (String, Required, Size: 50)
  - `description` (String, Optional, Size: 2048)
  - `dueDate` (DateTime, Required)
  - `status` (Enum, Required)
    - Elements: BACKLOG, TODO, IN_PROGRESS, IN_REVIEW, DONE
  - `position` (Integer, Required, Min: 1000, Max: 1000000)

2. **Projects** Collection:

- Attributes:
  - `workspaceId` (String, Required, Size: 50)
  - `imageId` (String, Optional, Size: 50)
  - `name` (String, Required, Size: 256)

3. **Members** Collection:

- Attributes:
  - `userId` (String, Required, Size: 50)
  - `workspaceId` (String, Required, Size: 50)
  - `role` (Enum, Required)
    - Elements: ADMIN, MEMBER

4. **Workspaces** Collection:

- Attributes:
  - `name` (String, Required, Size: 256)
  - `userId` (String, Required, Size: 50)
  - `imageId` (String, Optional, Size: 50)
  - `inviteCode` (String, Required, Size: 10)

#### Set Permissions for Collections

For each collection:

1. Navigate to **Settings** > **Permissions**.
2. Add the role **All Users** with **Create**, **Read**, **Update**, and **Delete** permissions and click Update.

3. Copy the **Collection IDs** (displayed near collection names) for each collection and save them in `.env.local` as `NEXT_PUBLIC_APPWRITE_MEMBERS_ID`, `NEXT_PUBLIC_APPWRITE_PROJECTS_ID`, `NEXT_PUBLIC_APPWRITE_TASKS_ID`, and `NEXT_PUBLIC_APPWRITE_WORKSPACES_ID`.

---

### 10. Add Index to the Tasks Collection

1. Go to the **Tasks** collection.
2. Navigate to the **Indexes** tab.
3. Create a new index:
   - Name: `task_name`.
   - Type: **Full Text**.
   - Attribute: **name**.
   - Order: **DESC**.

---

### 11. Create a Bucket for Images

1. Go to the **Storage** tab.
2. Create a new bucket named `images` (or any preferred name).
3. Configure bucket settings:
   - **Permissions**: Add the role **All Users** with **Create**, **Read**, **Update**, and **Delete** permissions.
   - **Maximum File Size**: Set to **1 MB**.
   - **Allowed File Extensions**: Add `jpg`, `png`, and `jpeg`.
   - Save the settings.
4. Copy the **Bucket ID** (displayed near the bucket name) and save it in `.env.local` as `NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID`.

---

## 12. Configure OAuth with Google

1. Go to the **Auth** tab in Appwrite > **Settings**.
2. Enable **Google** and copy the provided **Redirect URI**.
3. Visit the [Google Cloud Console](https://console.cloud.google.com):
   - **Create a new project** and configure the **OAuth consent screen** with default settings.
4. Create **OAuth 2.0 credentials**:
   - Add the copied **Redirect URI** from Appwrite as the **Authorized Redirect URI**.
5. After creation, copy the generated **Client ID** and **Client Secret**.
6. Return to Appwrite and paste the **Client ID** and **Client Secret** into the corresponding fields for **App ID** and **App Secret**, then click **Update**.

---

## 13. Configure OAuth with GitHub

1. Go to the **Auth** tab in Appwrite > **Settings**.
2. Enable **GitHub** and copy the provided **Redirect URI**.
3. Visit the [GitHub Developer Settings](https://github.com/settings/developers):
   - Under **OAuth Apps**, click **New OAuth App**.
4. Fill out the required fields:
   - **Application Name**: `Jira Clone` (or any preferred name).
   - **Homepage URL**: `http://localhost:3000` (or your app's base URL).
   - **Authorization Callback URL**: Paste the **Redirect URI** copied from Appwrite.
5. Click **Register Application**.
6. After registration, you'll receive a **Client ID** and **Client Secret**.
7. Return to Appwrite and paste the **Client ID** and **Client Secret** into the corresponding fields for **App ID** and **App Secret**, then click **Update**.

---

14. Install Project Dependencies using `npm install --legacy-peer-deps` or `yarn install --legacy-peer-deps` or `bun install --legacy-peer-deps`.

15. Now app is fully configured 👍 and you can start using this app using either one of `npm run dev` or `yarn dev` or `bun dev`.
