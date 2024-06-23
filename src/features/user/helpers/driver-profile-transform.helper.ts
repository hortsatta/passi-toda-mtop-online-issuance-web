import dayjs from '#/config/dayjs.config';
import { transformAuditTrail } from '#/core/helpers/core.helper';
import { generateFullNames } from './user-helper';

import type { DriverProfile } from '../models/driver-profile.model';
import type { DriverProfileUpsertFormData } from '../models/driver-profile-form-data.model';

export function transformToDriverProfile({
  id,
  createdAt,
  updatedAt,
  firstName,
  lastName,
  middleName,
  birthDate,
  gender,
  civilStatus,
  religion,
  address,
  phoneNumber,
  driverLicenseNo,
  email,
}: any): DriverProfile {
  const { fullName, reverseFullName } = generateFullNames(
    firstName,
    lastName,
    middleName,
  );

  return {
    firstName,
    lastName,
    middleName,
    birthDate: dayjs(birthDate).toDate(),
    gender,
    civilStatus,
    religion,
    address,
    phoneNumber,
    driverLicenseNo,
    email,
    fullName,
    reverseFullName,
    ...transformAuditTrail(id, createdAt, updatedAt),
  };
}

export function transformToDriverProfileFormData({
  firstName,
  lastName,
  middleName,
  birthDate,
  gender,
  civilStatus,
  religion,
  address,
  phoneNumber,
  driverLicenseNo,
  email,
}: any): DriverProfileUpsertFormData {
  return {
    firstName,
    lastName,
    birthDate: dayjs(birthDate).toDate(),
    gender,
    civilStatus,
    religion,
    address,
    phoneNumber,
    driverLicenseNo,
    email,
    middleName,
  };
}

export function transformToDriverProfileUpsertDto({
  firstName,
  lastName,
  birthDate,
  gender,
  civilStatus,
  religion,
  address,
  phoneNumber,
  driverLicenseNo,
  email,
  middleName,
}: any) {
  return {
    email,
    firstName,
    lastName,
    birthDate,
    phoneNumber,
    gender,
    civilStatus,
    religion,
    address,
    middleName,
    driverLicenseNo,
  };
}
