import { generateSearchParams, kyInstance } from '#/config/ky.config';

import type { UseQueryOptions } from '@tanstack/react-query';
import type { DriverProfile } from '../models/driver-profile.model';
import { generateApiError } from '#/core/helpers/api.helper';
import { transformToDriverProfile } from '../helpers/driver-profile-transform.helper';
import { queryDriverProfileKey } from '#/config/react-query-keys.config';

const BASE_URL = 'driver-profiles';
const MEMBER_URL = 'member';

export function getAllMemberDriverProfiles(
  keys?: {
    ids?: number[];
    q?: string;
    status?: string;
    sort?: string;
  },
  options?: Omit<
    UseQueryOptions<DriverProfile[], Error, DriverProfile[], any>,
    'queryFn' | 'queryKey'
  > & { queryKey?: any },
) {
  const { ids, q, status, sort } = keys || {};
  const { queryKey, ...moreOptions } = options || {};

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/${MEMBER_URL}/list/all`;
    const searchParams = generateSearchParams({
      ids: ids?.join(','),
      q,
      status,
      sort,
    });

    try {
      const driverProfiles = await kyInstance.get(url, { searchParams }).json();
      return (driverProfiles as any[]).map((driverProfile) =>
        transformToDriverProfile(driverProfile),
      );
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [
      ...(queryKey?.length ? queryKey : queryDriverProfileKey.list),
      { q, ids, status, sort },
    ],
    queryFn,
    ...moreOptions,
  };
}

export function getDriverProfileById(
  keys: { id: number; status?: string; exclude?: string; include?: string },
  options?: Omit<
    UseQueryOptions<DriverProfile, Error, DriverProfile, any>,
    'queryFn' | 'queryKey'
  >,
) {
  const { id, status, exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/${id}`;
    const searchParams = generateSearchParams({ status, exclude, include });

    try {
      const driverProfile = await kyInstance.get(url, { searchParams }).json();
      return transformToDriverProfile(driverProfile);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [
      ...queryDriverProfileKey.single,
      { id, status, exclude, include },
    ],
    queryFn,
    ...options,
  };
}

export function getMemberDriverProfileById(
  keys: { id: number; status?: string; exclude?: string; include?: string },
  options?: Omit<
    UseQueryOptions<DriverProfile, Error, DriverProfile, any>,
    'queryFn' | 'queryKey'
  >,
) {
  const { id, status, exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/${MEMBER_URL}/${id}`;
    const searchParams = generateSearchParams({ status, exclude, include });

    try {
      const driverProfile = await kyInstance.get(url, { searchParams }).json();
      return transformToDriverProfile(driverProfile);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [
      ...queryDriverProfileKey.single,
      { id, status, exclude, include },
    ],
    queryFn,
    ...options,
  };
}
