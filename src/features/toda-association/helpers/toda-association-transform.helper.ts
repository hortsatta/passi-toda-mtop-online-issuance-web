import { transformAuditTrail } from '#/core/helpers/core.helper';
import { generateFullNames } from '#/user/helpers/user-helper';
import { transformToFranchise } from '#/franchise/helpers/franchise-transform.helper';

import type { TodaAssociation } from '../models/toda-association.model';
import type { TodaAssociationUpsertFormData } from '../models/toda-association-form-data.model';

export function transformToTodaAssociation({
  id,
  createdAt,
  updatedAt,
  deletedAt,
  name,
  authorizedRoute,
  presidentFirstName,
  presidentLastName,
  presidentMiddleName,
  franchiseCount,
  franchises,
}: any): TodaAssociation {
  const {
    fullName: presidentFullName,
    reverseFullName: presidentReverseFullName,
  } = generateFullNames(
    presidentFirstName,
    presidentLastName,
    presidentMiddleName,
  );

  return {
    name,
    authorizedRoute,
    presidentFirstName,
    presidentLastName,
    presidentMiddleName,
    presidentFullName,
    presidentReverseFullName,
    franchiseCount: +franchiseCount || undefined,
    franchises: franchises?.length
      ? franchises.map((franchise: any) => transformToFranchise(franchise))
      : [],
    ...transformAuditTrail(id, createdAt, updatedAt, deletedAt),
  };
}

export function transformToTodaAssociationFormData({
  name,
  authorizedRoute,
  presidentFirstName,
  presidentLastName,
  presidentMiddleName,
}: any): TodaAssociationUpsertFormData {
  return {
    name,
    authorizedRoute,
    presidentFirstName,
    presidentLastName,
    presidentMiddleName,
  };
}
