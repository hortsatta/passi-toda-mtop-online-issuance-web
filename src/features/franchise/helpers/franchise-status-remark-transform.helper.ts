import { transformAuditTrail } from '#/core/helpers/core.helper';

import type { FranchiseStatusRemark } from '../models/franchise-status-remark.model';
import type { FranchiseStatusRemarkUpsertFormData } from '../models/franchise-status-remark-form-data.model';

export function transformToFranchiseStatusRemark({
  id,
  createdAt,
  updatedAt,
  deletedAt,
  fieldName,
  remark,
}: any): FranchiseStatusRemark {
  return {
    fieldName,
    remark,
    ...transformAuditTrail(id, createdAt, updatedAt, deletedAt),
  };
}

export function transformToFranchiseStatusRemarkFormData({
  fieldName,
  remark,
}: any): FranchiseStatusRemarkUpsertFormData {
  return { fieldName, remark };
}

export function transformToFranchiseStatusRemarkUpsertDto({
  fieldName,
  remark,
}: any) {
  return {
    fieldName,
    remark,
  };
}
