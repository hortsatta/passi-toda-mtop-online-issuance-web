import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { queryTodaAssociationKey } from '#/config/react-query-keys.config';
import { generateApiError } from '#/core/helpers/api.helper';
import {
  transformToTodaAssociation,
  transformToTodaAssociationFormData,
} from '../helpers/toda-association-transform.helper';

import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type { TodaAssociation } from '../models/toda-association.model';
import type { TodaAssociationUpsertFormData } from '../models/toda-association-form-data.model';

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
      const todaAssociations = await kyInstance
        .get(url, { searchParams })
        .json();
      return (todaAssociations as any[]).map((toda) =>
        transformToTodaAssociation(toda),
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
    'queryFn' | 'queryKey'
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
      return transformToTodaAssociation(todaAssociation);
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

export function createTodaAssociation(
  options?: Omit<
    UseMutationOptions<
      TodaAssociation,
      Error,
      TodaAssociationUpsertFormData,
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async (
    data: TodaAssociationUpsertFormData,
  ): Promise<any> => {
    const json = transformToTodaAssociationFormData(data);

    try {
      const todaAssociation = await kyInstance.post(BASE_URL, { json }).json();
      return transformToTodaAssociation(todaAssociation);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function editTodaAssociation(
  options?: Omit<
    UseMutationOptions<
      TodaAssociation,
      Error,
      { id: number; data: TodaAssociationUpsertFormData },
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async ({
    id,
    data,
  }: {
    id: number;
    data: TodaAssociationUpsertFormData;
  }): Promise<any> => {
    const url = `${BASE_URL}/${id}`;
    const json = transformToTodaAssociationFormData(data);

    try {
      const todaAssociation = await kyInstance.patch(url, { json }).json();
      return transformToTodaAssociation(todaAssociation);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function deleteTodaAssociation(
  options?: Omit<UseMutationOptions<boolean, Error, number, any>, 'mutationFn'>,
) {
  const mutationFn = async (id: number): Promise<boolean> => {
    const url = `${BASE_URL}/${id}`;

    try {
      const success: boolean = await kyInstance.delete(url).json();
      return success;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}
