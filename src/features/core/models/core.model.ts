export type AuditTrail = {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

export type QueryFilterOption = {
  key: string;
  name: string;
  value: string;
  label: string;
};

export type QuerySortOption = {
  value: string;
  label: string;
};

export type QuerySort = {
  field: string;
  order: 'asc' | 'desc';
};

export type SelectItem = {
  value: string | number;
  label?: string;
};

export type ButtonVariant = 'primary' | 'accent' | 'accept' | 'warn';

// export type QueryPagination = {
//   take: number;
//   skip: number;
// };
