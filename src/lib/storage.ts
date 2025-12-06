import { mkdir, readFile, rm, writeFile } from 'fs/promises';
import path from 'path';

const STORAGE_ROOT = process.env.FILE_STORAGE_ROOT ?? path.join(process.cwd(), 'public', 'uploads');

const getBucketPath = (bucketId: string) => path.join(STORAGE_ROOT, bucketId);
const getFilePath = (bucketId: string, fileId: string) => path.join(getBucketPath(bucketId), fileId);

const ensureBucket = async (bucketId: string) => {
  const bucketPath = getBucketPath(bucketId);
  await mkdir(bucketPath, { recursive: true });
  return bucketPath;
};

const fileToBuffer = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

export const storage = {
  async createFile(bucketId: string, fileId: string, file: File) {
    await ensureBucket(bucketId);

    const targetPath = getFilePath(bucketId, fileId);
    const buffer = await fileToBuffer(file);

    await writeFile(targetPath, buffer);

    return {
      $id: fileId,
    };
  },

  async getFileView(bucketId: string, fileId: string) {
    const targetPath = getFilePath(bucketId, fileId);
    return readFile(targetPath);
  },

  async deleteFile(bucketId: string, fileId: string) {
    const targetPath = getFilePath(bucketId, fileId);

    await rm(targetPath, {
      force: true,
    });
  },
};
