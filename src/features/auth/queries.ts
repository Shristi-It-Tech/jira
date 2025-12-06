'use server';

import { cookies } from 'next/headers';

export const getCurrent = async () => {
  try {
    const cookieHeader = cookies()
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join('; ');

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/auth/current`, {
      method: 'GET',
      headers: {
        cookie: cookieHeader,
      },
      cache: 'no-store',
    });

    if (!response.ok) return null;

    const { data } = await response.json();
    return data;
  } catch {
    return null;
  }
};
