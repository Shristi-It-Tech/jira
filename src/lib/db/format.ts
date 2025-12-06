// @ts-nocheck
import type { DocumentList } from '@/types/database';

export const toDocumentList = <T>(documents: T[]): DocumentList<T> => ({
  documents,
  total: documents.length,
});
