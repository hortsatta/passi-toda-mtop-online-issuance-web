import type { AuditTrail } from '#/core/models/core.model';

export type FranchiseStatusRemark = Partial<AuditTrail> & {
  id: number;
  remark: string;
  fieldName?: string;
};

export type FranchiseStatusFieldError = {
  name: string;
  label: string;
};
