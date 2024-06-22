export type AuditTrail = {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

export type DateRange = {
  startDate: Date;
  endDate: Date;
};

export type QueryFilterOption = {
  key: string;
  name: string;
  label: string;
  value: any;
};

export type QuerySortOption = {
  value: string;
  label: string;
};

export type QuerySort = {
  field: string;
  order: 'asc' | 'desc';
};

// export type QueryPagination = {
//   take: number;
//   skip: number;
// };
