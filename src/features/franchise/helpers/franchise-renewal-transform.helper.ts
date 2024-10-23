import dayjs from '#/config/dayjs.config';
import { transformAuditTrail } from '#/core/helpers/core.helper';
import {
  transformToDriverProfile,
  transformToDriverProfileFormData,
  transformToDriverProfileUpsertDto,
} from '#/user/helpers/driver-profile-transform.helper';
import { transformToTodaAssociation } from '#/toda-association/helpers/toda-association-transform.helper';
import { transformToFranchise } from './franchise-transform.helper';
import { transformToFranchiseStatusRemark } from './franchise-status-remark-transform.helper';

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
  ctcCedulaImgUrl,
  voterRegRecordImgUrl,
  approvalStatus,
  approvalDate,
  expiryDate,
  todaAssociation,
  isDriverOwner,
  driverProfile,
  paymentORNo,
  franchiseStatusRemarks,
  franchise,
}: any): FranchiseRenewal {
  const transformedFranchiseStatusRemarks = franchiseStatusRemarks
    ? franchiseStatusRemarks.map((franchiseStatusRemarks: any) =>
        transformToFranchiseStatusRemark(franchiseStatusRemarks),
      )
    : undefined;

  return {
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
    todaAssociation: transformToTodaAssociation(todaAssociation),
    isDriverOwner,
    driverProfile: driverProfile
      ? transformToDriverProfile(driverProfile)
      : undefined,
    paymentORNo,
    franchiseStatusRemarks: transformedFranchiseStatusRemarks,
    franchise: franchise
      ? transformToFranchise({ ...franchise, todaAssociation })
      : undefined,
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
  ctcCedulaImgUrl,
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
    ctcCedulaImgUrl,
    voterRegRecordImgUrl,
    todaAssociationId,
    driverProfileId,
    driverProfile: transformedDriverProfile,
    franchiseId: 0,
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
    ctcCedulaImgUrl: '',
    voterRegRecordImgUrl: '',
    todaAssociationId: +todaAssociationId,
    driverProfileId: +driverProfileId,
    driverProfile: transformedDriverProfile,
    franchiseId: +franchiseId,
  };
}

export function transformToFranchiseRenewalUpsertDto({
  mvFileNo,
  vehicleMake,
  vehicleMotorNo,
  vehicleChassisNo,
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
  franchiseId,
}: any) {
  const transformedDriverProfile = driverProfile
    ? transformToDriverProfileUpsertDto(driverProfile)
    : undefined;

  return {
    mvFileNo,
    vehicleMake,
    vehicleMotorNo,
    vehicleChassisNo,
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
    franchiseId: +franchiseId,
  };
}
