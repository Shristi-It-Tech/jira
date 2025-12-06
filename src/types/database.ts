export type BaseDocument = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
};

export type WithDocument<T> = T & BaseDocument;

export type DocumentList<T> = {
  documents: Array<WithDocument<T>>;
  total: number;
};
