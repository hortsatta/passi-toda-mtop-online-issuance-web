import { kyInstance } from '#/config/ky.config';
import { generateApiError } from '#/core/helpers/api.helper';

import { queryUserKey } from '#/config/react-query-keys.config';
import {
  transformToUser,
  transformToUserCreateDto,
  transformToUserUpdateDto,
} from '../helpers/user-transform.helper';

import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type { User } from '../models/user.model';
import type {
  UserCreateFormData,
  UserUpdateFormData,
} from '../models/user-form-data.model';

const BASE_URL = 'users';
const MEMBER_URL = `${BASE_URL}/members`;
const TREASURER_URL = `${BASE_URL}/treasurers`;
const ISSUER_URL = `${BASE_URL}/issuers`;

export function getCurrentUser(
  options?: Omit<
    UseQueryOptions<User | null, Error, User | null, any>,
    'queryKey' | 'queryFn'
  >,
) {
  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/me`;

    try {
      const user = await kyInstance.get(url).json();
      return transformToUser(user);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: queryUserKey.currentUser,
    queryFn,
    ...options,
  };
}

export function registerMemberUser(
  options?: Omit<
    UseMutationOptions<User | null, Error, UserCreateFormData, any>,
    'mutationFn'
  >,
) {
  const mutationFn = async (data: UserCreateFormData): Promise<any> => {
    const url = `${MEMBER_URL}/register`;
    const json = transformToUserCreateDto(data);

    try {
      const user = await kyInstance.post(url, { json }).json();
      return transformToUser(user);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function registerTreasurerUser(
  options?: Omit<
    UseMutationOptions<User | null, Error, UserCreateFormData, any>,
    'mutationFn'
  >,
) {
  const mutationFn = async (data: UserCreateFormData): Promise<any> => {
    const url = `${TREASURER_URL}/register`;
    const json = transformToUserCreateDto(data);

    try {
      const user = await kyInstance.post(url, { json }).json();
      return transformToUser(user);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function registerIssuerUser(
  options?: Omit<
    UseMutationOptions<User | null, Error, UserCreateFormData, any>,
    'mutationFn'
  >,
) {
  const mutationFn = async (data: UserCreateFormData): Promise<any> => {
    const url = `${ISSUER_URL}/register`;
    const json = transformToUserCreateDto(data);

    try {
      const user = await kyInstance.post(url, { json }).json();
      return transformToUser(user);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function editUser(
  options?: Omit<
    UseMutationOptions<User, Error, UserUpdateFormData, any>,
    'mutationFn'
  >,
) {
  const mutationFn = async (data: UserUpdateFormData): Promise<any> => {
    const url = BASE_URL;
    const json = transformToUserUpdateDto(data);

    try {
      const user = await kyInstance.patch(url, { json }).json();
      return transformToUser(user);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}
