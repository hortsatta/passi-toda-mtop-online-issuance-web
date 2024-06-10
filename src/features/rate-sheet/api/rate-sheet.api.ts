import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { generateApiError } from '#/core/helpers/api.helper';
import { queryRateSheetKey } from '#/config/react-query-keys.config';
import { transformToRateSheet } from '../helpers/rate-sheet-transform.helper';

import type { UseQueryOptions } from '@tanstack/react-query';
import type { RateSheet } from '../models/rate-sheet.model';

const BASE_URL = 'rate-sheets';

export function getAllRateSheets(
  keys?: {
    ids?: number[];
    q?: string;
    sort?: string;
  },
  options?: Omit<
    UseQueryOptions<RateSheet[], Error, RateSheet[], any>,
    'queryFn' | 'queryKey'
  > & { queryKey?: any },
) {
  const { ids, q, sort } = keys || {};
  const { queryKey, ...moreOptions } = options || {};

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/list/all`;
    const searchParams = generateSearchParams({
      ids: ids?.join(','),
      q,
      sort,
    });

    try {
      const franchises = await kyInstance.get(url, { searchParams }).json();
      return (franchises as any[]).map((franchise) =>
        transformToRateSheet(franchise),
      );
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [
      ...(queryKey?.length ? queryKey : queryRateSheetKey.list),
      { q, ids, sort },
    ],
    queryFn,
    ...moreOptions,
  };
}

export function getRateSheetById(
  keys: { id: number; exclude?: string; include?: string },
  options?: Omit<UseQueryOptions<RateSheet, Error, RateSheet, any>, 'queryFn'>,
) {
  const { id, exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/${id}`;
    const searchParams = generateSearchParams({ exclude, include });

    try {
      const rateSheet = await kyInstance.get(url, { searchParams }).json();
      return rateSheet;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryRateSheetKey.single, { id, exclude, include }],
    queryFn,
    ...options,
  };
}

export function getLatestRateSheet(
  keys: { exclude?: string; include?: string },
  options?: Omit<
    UseQueryOptions<RateSheet, Error, RateSheet, any>,
    'queryFn' | 'queryKey'
  >,
) {
  const { exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/latest`;
    const searchParams = generateSearchParams({ exclude, include });

    try {
      const rateSheet = await kyInstance.get(url, { searchParams }).json();
      return transformToRateSheet(rateSheet);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryRateSheetKey.latestSingle, { exclude, include }],
    queryFn,
    ...options,
  };
}
