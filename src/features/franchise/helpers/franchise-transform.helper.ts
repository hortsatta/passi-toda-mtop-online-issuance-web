import dayjs from '#/config/dayjs.config';
import { transformAuditTrail } from '#/core/helpers/core.helper';
import { transformToUser } from '#/user/helpers/user-transform.helper';
import { transformToTodaAssociation } from './toda-association-transform.helper';

import type { Franchise } from '../models/franchise.model';
import type { FranchiseUpsertFormData } from '../models/franchise-form-data.model';

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
    // TODO change img url to complete url from env
    vehicleORImgUrl,
    vehicleCRImgUrl,
    todaAssocMembershipImgUrl,
    ownerDriverLicenseNoImgUrl,
    brgyClearanceImgUrl,
    voterRegRecordImgUrl,
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
