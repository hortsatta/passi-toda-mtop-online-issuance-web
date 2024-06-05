import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { queryFranchiseKey } from '#/config/react-query-keys.config';
import { generateApiError } from '#/core/helpers/api.helper';
import {
  transformToFranchise,
  transformToFranchiseUpsertDto,
} from '../helpers/franchise-transform.helper';

import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  Franchise,
  FranchiseApprovalStatus,
} from '../models/franchise.model';
import type { FranchiseUpsertFormData } from '../models/franchise-form-data.model';

const BASE_URL = 'franchises';

// TODO pagination

export function getFranchisesByCurrentMemberUser(
  keys?: {
    ids?: number[];
    q?: string;
    status?: string;
    sort?: string;
  },
  options?: Omit<
    UseQueryOptions<Franchise[], Error, Franchise[], any>,
    'queryFn'
  >,
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
        transformToFranchise(franchise),
      );
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [
      ...(queryKey?.length ? queryKey : queryFranchiseKey.list),
      { q, ids, status, sort },
    ],
    queryFn,
    ...moreOptions,
  };
}

export function getFranchisesByMemberId(
  keys: {
    memberId: number;
    ids?: number[];
    q?: string;
    status?: string;
    sort?: string;
  },
  options?: Omit<
    UseQueryOptions<Franchise[], Error, Franchise[], any>,
    'queryFn'
  >,
) {
  const { memberId, ids, q, status, sort } = keys || {};
  const { queryKey, ...moreOptions } = options || {};

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/list/all`;
    const searchParams = generateSearchParams({
      memberId: memberId.toString(),
      ids: ids?.join(','),
      q,
      status,
      sort,
    });

    try {
      const franchises = await kyInstance.get(url, { searchParams }).json();
      return (franchises as any[]).map((franchise) =>
        transformToFranchise(franchise),
      );
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [
      ...(queryKey?.length ? queryKey : queryFranchiseKey.list),
      { q, ids, status, sort },
    ],
    queryFn,
    ...moreOptions,
  };
}

export function getFranchiseById(
  keys: { id: number; status?: string; exclude?: string; include?: string },
  options?: Omit<
    UseQueryOptions<Franchise, Error, Franchise, any>,
    'queryKey' | 'queryFn'
  >,
) {
  const { id, status, exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/${id}`;
    const searchParams = generateSearchParams({ status, exclude, include });

    try {
      const franchise = await kyInstance.get(url, { searchParams }).json();
      return franchise;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryFranchiseKey.single, { id, status, exclude, include }],
    queryFn,
    ...options,
  };
}

export function createFranchise(
  options?: Omit<
    UseMutationOptions<Franchise, Error, FranchiseUpsertFormData, any>,
    'mutationFn'
  >,
) {
  const mutationFn = async (data: FranchiseUpsertFormData): Promise<any> => {
    const json = transformToFranchiseUpsertDto(data);

    try {
      const franchise = await kyInstance.post(BASE_URL, { json }).json();
      console.log(franchise);
      return transformToFranchise(franchise);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function editFranchise(
  options?: Omit<
    UseMutationOptions<
      Franchise,
      Error,
      { id: number; data: FranchiseUpsertFormData },
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
    data: FranchiseUpsertFormData;
  }): Promise<any> => {
    const url = `${BASE_URL}/${id}`;
    const json = transformToFranchiseUpsertDto(data);

    try {
      const franchise = await kyInstance.patch(url, { json }).json();
      return transformToFranchise(franchise);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function approveFranchise(
  options?: Omit<
    UseMutationOptions<
      Franchise,
      Error,
      { id: number; approvalStatus?: FranchiseApprovalStatus },
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async ({
    id,
    approvalStatus,
  }: {
    id: number;
    approvalStatus?: FranchiseApprovalStatus;
  }): Promise<any> => {
    const url = `${BASE_URL}/approve/${id}`;

    try {
      const franchise = await kyInstance
        .patch(url, { json: { approvalStatus } })
        .json();
      return transformToFranchise(franchise);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function deleteFranchise(
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
