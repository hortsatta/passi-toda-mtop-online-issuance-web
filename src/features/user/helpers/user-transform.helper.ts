import dayjs from '#/config/dayjs.config';
import { generateFullNames } from './user-helper';

import { transformAuditTrail } from '#/core/helpers/core.helper';

import type { User, UserProfile } from '../models/user.model';

export function transformToUser({
  id,
  createdAt,
  updatedAt,
  role,
  email,
  approvalStatus,
  approvalDate,
  lastSignInDate,
  userProfile,
}: any): User {
  const transformedUserProfile = userProfile
    ? transformToUserProfile(userProfile)
    : ({} as any);

  return {
    lastSignInDate: lastSignInDate ? dayjs(lastSignInDate).toDate() : null,
    role,
    email,
    approvalStatus,
    approvalDate: approvalDate ? dayjs(approvalDate).toDate() : null,
    userProfile: transformedUserProfile,
    ...transformAuditTrail(id, createdAt, updatedAt),
  };
}

export function transformToUserProfile({
  id,
  createdAt,
  updatedAt,
  firstName,
  lastName,
  middleName,
  birthDate,
  phoneNumber,
  gender,
  driverLicenseNo,
}: any): UserProfile {
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
    phoneNumber,
    gender,
    driverLicenseNo,
    fullName,
    reverseFullName,
    ...transformAuditTrail(id, createdAt, updatedAt),
  };
}

export function transformToUserCreateDto({
  email,
  password,
  firstName,
  lastName,
  middleName,
  birthDate,
  phoneNumber,
  gender,
  driverLicenseNo,
  // approvalStatus = UserApprovalStatus.Approved,
}: any) {
  return {
    email,
    password,
    userProfile: {
      firstName,
      lastName,
      middleName,
      birthDate,
      phoneNumber: phoneNumber.replace(/\D/g, ''),
      gender,
      driverLicenseNo,
    },
  };
}

export function transformToUserUpdateDto({
  email,
  firstName,
  lastName,
  middleName,
  birthDate,
  phoneNumber,
  gender,
  driverLicenseNo,
}: any) {
  return {
    email,
    userProfile: {
      firstName,
      lastName,
      middleName,
      birthDate,
      phoneNumber: phoneNumber.replace(/\D/g, ''),
      gender,
      driverLicenseNo,
    },
  };
}
