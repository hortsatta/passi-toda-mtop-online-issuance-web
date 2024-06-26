import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { generateApiError } from '#/core/helpers/api.helper';
import { queryRateSheetKey } from '#/config/react-query-keys.config';
import {
  transformToRateSheet,
  transformToRateSheetUpsertDto,
} from '../helpers/rate-sheet-transform.helper';
import { FeeType } from '../models/rate-sheet.model';

import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type { RateSheet } from '../models/rate-sheet.model';
import type { RateSheetUpsertFormData } from '../models/rate-sheet-form-data.model';

const BASE_URL = 'rate-sheets';
const FRANCHISE_URL = 'franchises';

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
      const rateSheets = await kyInstance.get(url, { searchParams }).json();
      return (rateSheets as any[]).map((rateSheet) =>
        transformToRateSheet(rateSheet),
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
  options?: Omit<
    UseQueryOptions<RateSheet, Error, RateSheet, any>,
    'queryFn' | 'queryKey'
  >,
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

export function getLatestRateSheetByType(
  keys: { type: FeeType; exclude?: string; include?: string },
  options?: Omit<
    UseQueryOptions<RateSheet, Error, RateSheet, any>,
    'queryFn' | 'queryKey'
  >,
) {
  const { type, exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/latest`;
    const searchParams = generateSearchParams({ type, exclude, include });

    try {
      const rateSheet = await kyInstance.get(url, { searchParams }).json();
      return transformToRateSheet(rateSheet);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryRateSheetKey.latestSingle, { type, exclude, include }],
    queryFn,
    ...options,
  };
}

export function getFranchiseRateSheetsByFranchiseId(
  keys: { franchiseId: number },
  options?: Omit<
    UseQueryOptions<RateSheet[], Error, RateSheet[], any>,
    'queryFn' | 'queryKey'
  > & { queryKey?: any },
) {
  const { franchiseId } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/${FRANCHISE_URL}/list`;
    const searchParams = generateSearchParams({
      franchiseId: franchiseId.toString(),
    });

    try {
      const rateSheets = await kyInstance.get(url, { searchParams }).json();
      return (rateSheets as any[]).map((rateSheet) =>
        transformToRateSheet(rateSheet),
      );
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryRateSheetKey.latestSingle, { franchiseId }],
    queryFn,
    ...options,
  };
}

export function getRateSheetHistory(
  keys: { type: FeeType },
  options?: Omit<
    UseQueryOptions<RateSheet[], Error, RateSheet[], any>,
    'queryFn' | 'queryKey'
  > & { queryKey?: any },
) {
  const { type } = keys;
  const { queryKey, ...moreOptions } = options || {};

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/history`;
    const searchParams = generateSearchParams({ type });

    try {
      const rateSheets = await kyInstance.get(url, { searchParams }).json();
      return (rateSheets as any[]).map((rateSheet) =>
        transformToRateSheet(rateSheet),
      );
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [
      ...(queryKey?.length ? queryKey : queryRateSheetKey.historyList),
      { type },
    ],
    queryFn,
    ...moreOptions,
  };
}

export function getLatestFranchiseRateSheets(
  options?: Omit<
    UseQueryOptions<RateSheet[], Error, RateSheet[], any>,
    'queryFn' | 'queryKey'
  > & { queryKey?: any },
) {
  const types = [FeeType.FranchiseRegistration, FeeType.FranchiseRenewal];
  const { queryKey, ...moreOptions } = options || {};

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/list/latest`;
    const searchParams = generateSearchParams({ types: types?.join(',') });

    try {
      const rateSheets = await kyInstance.get(url, { searchParams }).json();
      return (rateSheets as any[]).map((rateSheet) =>
        transformToRateSheet(rateSheet),
      );
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [
      ...(queryKey?.length ? queryKey : queryRateSheetKey.list),
      { types },
    ],
    queryFn,
    ...moreOptions,
  };
}

export function createFranchiseRateSheet(
  options?: Omit<
    UseMutationOptions<RateSheet, Error, RateSheetUpsertFormData, any>,
    'mutationFn'
  >,
) {
  const mutationFn = async (data: RateSheetUpsertFormData): Promise<any> => {
    const json = transformToRateSheetUpsertDto(data);

    try {
      const rateSheet = await kyInstance.post(BASE_URL, { json }).json();
      return transformToRateSheet(rateSheet);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}
