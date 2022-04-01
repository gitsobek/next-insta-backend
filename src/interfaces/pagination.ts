export enum Sorting {
  ASCENDING = 'asc',
  DESCENDING = 'desc',
}

export interface Pagination {
  order: {
    by: string;
    type: Sorting;
  };
  page: number;
  limit: number;
}
