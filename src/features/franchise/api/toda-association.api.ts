import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { queryTodaAssociationKey } from '#/config/react-query-keys.config';
import { generateApiError } from '#/core/helpers/api.helper';
import { transformToTodaAssociation } from '../helpers/toda-association-transform.helper';

import type { UseQueryOptions } from '@tanstack/react-query';
import type { TodaAssociation } from '../models/toda-association.model';

const BASE_URL = 'toda-associations';

export function getAllTodaAssociations(
  keys?: {
    ids?: number[];
    q?: string;
    status?: string;
    sort?: string;
  },
  options?: Omit<
    UseQueryOptions<TodaAssociation[], Error, TodaAssociation[], any>,
    'queryFn' | 'queryKey'
  > & { queryKey?: any },
) {
  const { ids, q, status, sort } = keys || {};
  const { queryKey, ...moreOptions } = options || {};

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/list/all`;
    const searchParams = generateSearchParams({
      ids: ids?.join(','),
      q,
      status,
      sort,
    });

    try {
      const franchises = await kyInstance.get(url, { searchParams }).json();
      return (franchises as any[]).map((franchise) =>
        transformToTodaAssociation(franchise),
      );
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [
      ...(queryKey?.length ? queryKey : queryTodaAssociationKey.list),
      { q, ids, status, sort },
    ],
    queryFn,
    ...moreOptions,
  };
}

export function getTodaAssociationById(
  keys: { id: number; status?: string; exclude?: string; include?: string },
  options?: Omit<
    UseQueryOptions<TodaAssociation, Error, TodaAssociation, any>,
    'queryFn'
  >,
) {
  const { id, status, exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/${id}`;
    const searchParams = generateSearchParams({ status, exclude, include });

    try {
      const todaAssociation = await kyInstance
        .get(url, { searchParams })
        .json();
      return todaAssociation;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [
      ...queryTodaAssociationKey.single,
      { id, status, exclude, include },
    ],
    queryFn,
    ...options,
  };
}
