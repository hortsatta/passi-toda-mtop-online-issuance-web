import dayjs from '#/config/dayjs.config';
import { transformAuditTrail } from '#/core/helpers/core.helper';
import { transformToUser } from '#/user/helpers/user-transform.helper';
import {
  transformToDriverProfile,
  transformToDriverProfileFormData,
  transformToDriverProfileUpsertDto,
} from '#/user/helpers/driver-profile-transform.helper';
import { transformToTodaAssociation } from '#/toda-association/helpers/toda-association-transform.helper';
import { transformToFranchiseRenewal } from './franchise-renewal-transform.helper';
import { transformToFranchiseStatusRemark } from './franchise-status-remark-transform.helper';

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
  vehicleORImgUrl,
  vehicleCRImgUrl,
  todaAssocMembershipImgUrl,
  driverLicenseNoImgUrl,
  brgyClearanceImgUrl,
  ctcCedulaImgUrl,
  voterRegRecordImgUrl,
  approvalStatus,
  approvalDate,
  expiryDate,
  isExpired,
  canRenew,
  todaAssociation,
  isDriverOwner,
  driverProfile,
  paymentORNo,
  franchiseStatusRemarks,
  franchiseRenewals,
  user,
}: any): Franchise {
  const transformedDriverProfile = driverProfile
    ? transformToDriverProfile(driverProfile)
    : undefined;

  const transformedFranchiseStatusRemarks = franchiseStatusRemarks
    ? franchiseStatusRemarks.map((franchiseStatusRemarks: any) =>
        transformToFranchiseStatusRemark(franchiseStatusRemarks),
      )
    : undefined;

  const transformedFranchiseRenewals = franchiseRenewals
    ? franchiseRenewals.map((franchiseRenewal: any) =>
        transformToFranchiseRenewal(franchiseRenewal),
      )
    : [];

  return {
    mvFileNo,
    plateNo,
    vehicleORImgUrl: `${IMG_BASE_URL}${vehicleORImgUrl}`,
    vehicleCRImgUrl: `${IMG_BASE_URL}${vehicleCRImgUrl}`,
    todaAssocMembershipImgUrl: `${IMG_BASE_URL}${todaAssocMembershipImgUrl}`,
    driverLicenseNoImgUrl: `${IMG_BASE_URL}${driverLicenseNoImgUrl}`,
    brgyClearanceImgUrl: `${IMG_BASE_URL}${brgyClearanceImgUrl}`,
    ctcCedulaImgUrl: `${IMG_BASE_URL}${ctcCedulaImgUrl}`,
    voterRegRecordImgUrl: voterRegRecordImgUrl?.trim()
      ? `${IMG_BASE_URL}${voterRegRecordImgUrl}`
      : undefined,
    approvalStatus,
    approvalDate: approvalDate ? dayjs(approvalDate).toDate() : null,
    expiryDate: expiryDate ? dayjs(expiryDate).toDate() : null,
    isExpired,
    canRenew,
    todaAssociation: transformToTodaAssociation(todaAssociation),
    isDriverOwner,
    driverProfile: transformedDriverProfile,
    paymentORNo,
    franchiseStatusRemarks: transformedFranchiseStatusRemarks,
    franchiseRenewals: transformedFranchiseRenewals,
    user: user ? transformToUser(user) : undefined,
    ...transformAuditTrail(id, createdAt, updatedAt, deletedAt),
  };
}

export function transformToFranchiseFormData({
  mvFileNo,
  plateNo,
  isDriverOwner,
  vehicleORImgUrl,
  vehicleCRImgUrl,
  todaAssocMembershipImgUrl,
  driverLicenseNoImgUrl,
  brgyClearanceImgUrl,
  ctcCedulaImgUrl,
  voterRegRecordImgUrl,
  todaAssociationId,
  driverProfileId,
  driverProfile,
}: any): FranchiseUpsertFormData {
  const transformedDriverProfile = driverProfile
    ? transformToDriverProfileFormData(driverProfile)
    : undefined;

  return {
    mvFileNo,
    plateNo,
    isDriverOwner,
    vehicleORImgUrl,
    vehicleCRImgUrl,
    todaAssocMembershipImgUrl,
    driverLicenseNoImgUrl,
    brgyClearanceImgUrl,
    ctcCedulaImgUrl,
    voterRegRecordImgUrl,
    todaAssociationId,
    driverProfileId,
    driverProfile: transformedDriverProfile,
  };
}

export function transformToFranchiseValidateDto({
  mvFileNo,
  plateNo,
  isDriverOwner,
  todaAssociationId,
  driverProfileId,
  driverProfile,
}: any) {
  const transformedDriverProfile = driverProfile
    ? transformToDriverProfileUpsertDto(driverProfile)
    : undefined;

  return {
    mvFileNo,
    plateNo,
    isDriverOwner,
    vehicleORImgUrl: '',
    vehicleCRImgUrl: '',
    todaAssocMembershipImgUrl: '',
    driverLicenseNoImgUrl: '',
    brgyClearanceImgUrl: '',
    ctcCedulaImgUrl: '',
    voterRegRecordImgUrl: '',
    todaAssociationId: +todaAssociationId,
    driverProfileId: +driverProfileId,
    driverProfile: transformedDriverProfile,
  };
}

export function transformToFranchiseUpsertDto({
  mvFileNo,
  plateNo,
  isDriverOwner,
  vehicleORImgUrl,
  vehicleCRImgUrl,
  todaAssocMembershipImgUrl,
  driverLicenseNoImgUrl,
  brgyClearanceImgUrl,
  ctcCedulaImgUrl,
  todaAssociationId,
  voterRegRecordImgUrl,
  driverProfileId,
  driverProfile,
}: any) {
  const transformedDriverProfile = driverProfile
    ? transformToDriverProfileUpsertDto(driverProfile)
    : undefined;

  return {
    mvFileNo,
    plateNo,
    isDriverOwner,
    vehicleORImgUrl,
    vehicleCRImgUrl,
    todaAssocMembershipImgUrl,
    driverLicenseNoImgUrl,
    brgyClearanceImgUrl,
    ctcCedulaImgUrl,
    voterRegRecordImgUrl,
    todaAssociationId: +todaAssociationId,
    driverProfileId: +driverProfileId,
    driverProfile: transformedDriverProfile,
  };
}
