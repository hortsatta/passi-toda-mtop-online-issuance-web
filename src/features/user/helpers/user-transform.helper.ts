import dayjs from '#/config/dayjs.config';
import { generateFullNames } from './user-helper';

import { UserApprovalStatus } from '../models/user.model';

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
  const transformedUserProfile = transformToUserProfile(userProfile);

  return {
    id,
    createdAt: dayjs(createdAt).toDate(),
    updatedAt: dayjs(updatedAt).toDate(),
    lastSignInDate: lastSignInDate ? dayjs(lastSignInDate).toDate() : null,
    role,
    email,
    approvalStatus,
    approvalDate: approvalDate ? dayjs(approvalDate).toDate() : null,
    userProfile: transformedUserProfile,
  };
}

export function transformToUserProfile({
  id,
  firstName,
  lastName,
  middleName,
  birthDate,
  phoneNumber,
  gender,
}: any): UserProfile {
  const { fullName, reverseFullName } = generateFullNames(
    firstName,
    lastName,
    middleName,
  );

  return {
    id,
    firstName,
    lastName,
    middleName,
    birthDate: dayjs(birthDate).toDate(),
    phoneNumber,
    gender,
    fullName,
    reverseFullName,
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
  approvalStatus = UserApprovalStatus.Approved,
}: any) {
  return {
    email,
    password,
    approvalStatus,
    userProfile: {
      firstName,
      lastName,
      middleName,
      birthDate,
      phoneNumber: phoneNumber.replace(/\D/g, ''),
      gender,
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
    },
  };
}
