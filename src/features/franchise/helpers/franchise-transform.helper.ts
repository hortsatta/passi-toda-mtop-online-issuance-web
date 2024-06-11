import dayjs from '#/config/dayjs.config';
import { transformAuditTrail } from '#/core/helpers/core.helper';
import { transformToUser } from '#/user/helpers/user-transform.helper';
import { transformToTodaAssociation } from '#/toda-association/helpers/toda-association-transform.helper';

import type { Franchise } from '../models/franchise.model';
import type { FranchiseUpsertFormData } from '../models/franchise-form-data.model';

const IMG_BASE_URL = import.meta.env.VITE_SUPABASE_BASE_URL;

export function transformToFranchise({
  id,
  createdAt,
  updatedAt,
  deletedAt,
  mvFileNo,
  plateNo,
  ownerDriverLicenseNo,
  vehicleORImgUrl,
  vehicleCRImgUrl,
  todaAssocMembershipImgUrl,
  ownerDriverLicenseNoImgUrl,
  brgyClearanceImgUrl,
  voterRegRecordImgUrl,
  approvalStatus,
  approvalDate,
  expiryDate,
  todaAssociation,
  user,
}: any): Franchise {
  return {
    mvFileNo,
    plateNo,
    ownerDriverLicenseNo,
    vehicleORImgUrl: `${IMG_BASE_URL}${vehicleORImgUrl}`,
    vehicleCRImgUrl: `${IMG_BASE_URL}${vehicleCRImgUrl}`,
    todaAssocMembershipImgUrl: `${IMG_BASE_URL}${todaAssocMembershipImgUrl}`,
    ownerDriverLicenseNoImgUrl: `${IMG_BASE_URL}${ownerDriverLicenseNoImgUrl}`,
    brgyClearanceImgUrl: `${IMG_BASE_URL}${brgyClearanceImgUrl}`,
    voterRegRecordImgUrl: `${IMG_BASE_URL}${voterRegRecordImgUrl}`,
    approvalStatus,
    approvalDate: approvalDate ? dayjs(approvalDate).toDate() : null,
    expiryDate: expiryDate ? dayjs(expiryDate).toDate() : null,
    todaAssociation: transformToTodaAssociation(todaAssociation),
    user: user ? transformToUser(user) : undefined,
    ...transformAuditTrail(id, createdAt, updatedAt, deletedAt),
  };
}

export function transformToFranchiseFormData({
  mvFileNo,
  plateNo,
  ownerDriverLicenseNo,
  vehicleORImgUrl,
  vehicleCRImgUrl,
  todaAssocMembershipImgUrl,
  ownerDriverLicenseNoImgUrl,
  brgyClearanceImgUrl,
  voterRegRecordImgUrl,
  todaAssociationId,
}: any): FranchiseUpsertFormData {
  return {
    mvFileNo,
    plateNo,
    ownerDriverLicenseNo,
    vehicleORImgUrl,
    vehicleCRImgUrl,
    todaAssocMembershipImgUrl,
    ownerDriverLicenseNoImgUrl,
    brgyClearanceImgUrl,
    todaAssociationId,
    voterRegRecordImgUrl,
  };
}

export function transformToFranchiseValidateDto({
  mvFileNo,
  plateNo,
  ownerDriverLicenseNo,
  todaAssociationId,
}: any) {
  return {
    mvFileNo,
    plateNo,
    ownerDriverLicenseNo,
    vehicleORImgUrl: '',
    vehicleCRImgUrl: '',
    todaAssocMembershipImgUrl: '',
    ownerDriverLicenseNoImgUrl: '',
    brgyClearanceImgUrl: '',
    todaAssociationId,
    voterRegRecordImgUrl: '',
  };
}

export function transformToFranchiseUpsertDto({
  mvFileNo,
  plateNo,
  ownerDriverLicenseNo,
  vehicleORImgUrl,
  vehicleCRImgUrl,
  todaAssocMembershipImgUrl,
  ownerDriverLicenseNoImgUrl,
  brgyClearanceImgUrl,
  todaAssociationId,
  voterRegRecordImgUrl,
}: any) {
  return {
    mvFileNo,
    plateNo,
    ownerDriverLicenseNo,
    vehicleORImgUrl,
    vehicleCRImgUrl,
    todaAssocMembershipImgUrl,
    ownerDriverLicenseNoImgUrl,
    brgyClearanceImgUrl,
    voterRegRecordImgUrl,
    todaAssociationId: +todaAssociationId,
  };
}
