import { transformAuditTrail } from '#/core/helpers/core.helper';
import { generateFullNames } from '#/user/helpers/user-helper';

import type { TodaAssociation } from '../models/toda-association.model';

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
    ...transformAuditTrail(id, createdAt, updatedAt, deletedAt),
  };
}
