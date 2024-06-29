import dayjs from '#/config/dayjs.config';
import { transformAuditTrail } from '#/core/helpers/core.helper';
import {
  transformToDriverProfile,
  transformToDriverProfileFormData,
  transformToDriverProfileUpsertDto,
} from '#/user/helpers/driver-profile-transform.helper';
import { transformToTodaAssociation } from '#/toda-association/helpers/toda-association-transform.helper';
import { transformToFranchise } from './franchise-transform.helper';

import type { FranchiseRenewal } from '../models/franchise-renewal.model';
import type { FranchiseRenewalUpsertFormData } from '../models/franchise-renewal-form-data.model';

const IMG_BASE_URL = import.meta.env.VITE_SUPABASE_BASE_URL;

export function transformToFranchiseRenewal({
  id,
  createdAt,
  updatedAt,
  deletedAt,
  vehicleORImgUrl,
  vehicleCRImgUrl,
  todaAssocMembershipImgUrl,
  driverLicenseNoImgUrl,
  brgyClearanceImgUrl,
  voterRegRecordImgUrl,
  approvalStatus,
  approvalDate,
  expiryDate,
  todaAssociation,
  isDriverOwner,
  driverProfile,
  franchise,
}: any): FranchiseRenewal {
  return {
    vehicleORImgUrl: `${IMG_BASE_URL}${vehicleORImgUrl}`,
    vehicleCRImgUrl: `${IMG_BASE_URL}${vehicleCRImgUrl}`,
    todaAssocMembershipImgUrl: `${IMG_BASE_URL}${todaAssocMembershipImgUrl}`,
    driverLicenseNoImgUrl: `${IMG_BASE_URL}${driverLicenseNoImgUrl}`,
    brgyClearanceImgUrl: `${IMG_BASE_URL}${brgyClearanceImgUrl}`,
    voterRegRecordImgUrl: voterRegRecordImgUrl?.trim()
      ? `${IMG_BASE_URL}${voterRegRecordImgUrl}`
      : undefined,
    approvalStatus,
    approvalDate: approvalDate ? dayjs(approvalDate).toDate() : null,
    expiryDate: expiryDate ? dayjs(expiryDate).toDate() : null,
    todaAssociation: transformToTodaAssociation(todaAssociation),
    isDriverOwner,
    driverProfile: driverProfile
      ? transformToDriverProfile(driverProfile)
      : undefined,
    franchise: franchise ? transformToFranchise(franchise) : undefined,
    ...transformAuditTrail(id, createdAt, updatedAt, deletedAt),
  };
}

export function transformToFranchiseRenewalFormData({
  isDriverOwner,
  vehicleORImgUrl,
  vehicleCRImgUrl,
  todaAssocMembershipImgUrl,
  driverLicenseNoImgUrl,
  brgyClearanceImgUrl,
  voterRegRecordImgUrl,
  todaAssociationId,
  driverProfileId,
  driverProfile,
}: any): FranchiseRenewalUpsertFormData {
  const transformedDriverProfile = driverProfile
    ? transformToDriverProfileFormData(driverProfile)
    : undefined;

  return {
    isDriverOwner,
    vehicleORImgUrl,
    vehicleCRImgUrl,
    todaAssocMembershipImgUrl,
    driverLicenseNoImgUrl,
    brgyClearanceImgUrl,
    voterRegRecordImgUrl,
    todaAssociationId,
    driverProfileId,
    driverProfile: transformedDriverProfile,
  };
}

export function transformToFranchiseRenewalValidateDto({
  isDriverOwner,
  todaAssociationId,
  driverProfileId,
  driverProfile,
  franchiseId,
}: any) {
  const transformedDriverProfile = driverProfile
    ? transformToDriverProfileUpsertDto(driverProfile)
    : undefined;

  return {
    isDriverOwner,
    vehicleORImgUrl: '',
    vehicleCRImgUrl: '',
    todaAssocMembershipImgUrl: '',
    driverLicenseNoImgUrl: '',
    brgyClearanceImgUrl: '',
    voterRegRecordImgUrl: '',
    todaAssociationId: +todaAssociationId,
    driverProfileId: +driverProfileId,
    driverProfile: transformedDriverProfile,
    franchiseId: +franchiseId,
  };
}

export function transformToFranchiseRenewalUpsertDto({
  mvFileNo,
  plateNo,
  isDriverOwner,
  vehicleORImgUrl,
  vehicleCRImgUrl,
  todaAssocMembershipImgUrl,
  driverLicenseNoImgUrl,
  brgyClearanceImgUrl,
  todaAssociationId,
  voterRegRecordImgUrl,
  driverProfileId,
  driverProfile,
  franchiseId,
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
    voterRegRecordImgUrl,
    todaAssociationId: +todaAssociationId,
    driverProfileId: +driverProfileId,
    driverProfile: transformedDriverProfile,
    franchiseId: +franchiseId,
  };
}
