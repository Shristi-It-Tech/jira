'use server';

import { cookies } from 'next/headers';

import type { Workspace } from '@/features/workspaces/types';
import type { DocumentList } from '@/types/database';

export const getWorkspaces = async (): Promise<DocumentList<Workspace>> => {
  try {
    const cookieHeader = cookies()
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join('; ');

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/workspaces`, {
      method: 'GET',
      headers: {
        cookie: cookieHeader,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return { documents: [], total: 0 };
    }

    const { data } = await response.json();
    return data as DocumentList<Workspace>;
  } catch {
    return { documents: [], total: 0 };
  }
};
