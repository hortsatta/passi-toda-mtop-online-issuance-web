import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { queryFranchiseKey } from '#/config/react-query-keys.config';
import { generateApiError } from '#/core/helpers/api.helper';
import {
  transformToFranchise,
  transformToFranchiseUpsertDto,
  transformToFranchiseValidateDto,
} from '../helpers/franchise-transform.helper';
import { generateImageFormData } from '../helpers/franchise-form.helper';

import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  FranchiseDigest,
  Franchise,
  FranchiseApprovalStatus,
} from '../models/franchise.model';
import type { FranchiseUpsertFormData } from '../models/franchise-form-data.model';

const BASE_URL = 'franchises';
const ISSUER_URL = 'issuer';
const TREASURER_URL = 'treasurer';

// TODO pagination

export function getAllFranchises(
  keys?: {
    ids?: number[];
    q?: string;
    status?: string;
    sort?: string;
    limit?: number;
  },
  options?: Omit<
    UseQueryOptions<Franchise[], Error, Franchise[], any>,
    'queryFn' | 'queryKey'
  > & { queryKey?: any },
) {
  const { q, status, sort, limit } = keys || {};
  const { queryKey, ...moreOptions } = options || {};

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/${ISSUER_URL}/list/all`;
    const searchParams = generateSearchParams({
      q,
      status,
      sort,
      limit: limit?.toString(),
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
      { q, status, sort },
    ],
    queryFn,
    ...moreOptions,
  };
}

export function getFranchisesByCurrentMemberUser(
  keys?: {
    ids?: number[];
    q?: string;
    status?: string;
    sort?: string;
  },
  options?: Omit<
    UseQueryOptions<Franchise[], Error, Franchise[], any>,
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

export function getFranchiseDigest(
  options?: Omit<
    UseQueryOptions<FranchiseDigest, Error, FranchiseDigest, any>,
    'queryFn' | 'queryKey'
  > & { queryKey?: any },
) {
  const { queryKey, ...moreOptions } = options || {};

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/${ISSUER_URL}/list/digest`;

    try {
      const data: any = await kyInstance.get(url).json();

      return {
        pendingValidations: (data.pendingValidations as any[]).map(
          (franchise) => transformToFranchise(franchise),
        ),
        validatedList: (data.validatedList as any[]).map((franchise) =>
          transformToFranchise(franchise),
        ),
        paidList: (data.paidList as any[]).map((franchise) =>
          transformToFranchise(franchise),
        ),
        recentApprovals: (data.recentApprovals as any[]).map((franchise) =>
          transformToFranchise(franchise),
        ),
        recentRejections: (data.recentRejections as any[]).map((franchise) =>
          transformToFranchise(franchise),
        ),
      };
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...(queryKey?.length ? queryKey : queryFranchiseKey.digestList)],
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
      return transformToFranchise(franchise);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryFranchiseKey.single, { id }],
    queryFn,
    ...options,
  };
}

export function getFranchiseByIdAsTreasurer(
  keys: { id: number; status?: string; exclude?: string; include?: string },
  options?: Omit<
    UseQueryOptions<Franchise, Error, Franchise, any>,
    'queryKey' | 'queryFn'
  >,
) {
  const { id, status, exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/${TREASURER_URL}/${id}`;
    const searchParams = generateSearchParams({ status, exclude, include });

    try {
      const franchise = await kyInstance.get(url, { searchParams }).json();
      return transformToFranchise(franchise);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryFranchiseKey.single, { id }],
    queryFn,
    ...options,
  };
}

export function checkFranchiseByMvPlateNo(
  keys: { mvPlateNo: string },
  options?: Omit<
    UseQueryOptions<Franchise | null, Error, Franchise | null, any>,
    'queryKey' | 'queryFn'
  >,
) {
  const { mvPlateNo } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/check/${mvPlateNo}`;

    try {
      const franchise = await kyInstance.get(url).json();
      return franchise ? transformToFranchise(franchise) : null;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryFranchiseKey.checkSingle, { mvPlateNo }],
    queryFn,
    ...options,
  };
}

export function validateUpsertFranchise(
  options?: Omit<
    UseMutationOptions<
      boolean,
      Error,
      { data: FranchiseUpsertFormData; id?: number },
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async ({
    data,
    id,
  }: {
    data: FranchiseUpsertFormData;
    id?: number;
  }): Promise<boolean> => {
    const url = `${BASE_URL}/validate`;
    const json = transformToFranchiseValidateDto(data);
    const searchParams = generateSearchParams({
      id: id?.toString(),
    });

    try {
      const result = await kyInstance.post(url, { json, searchParams }).json();
      return result as boolean;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
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

export function uploadFranchiseFiles(
  options?: Omit<
    UseMutationOptions<string[], Error, FranchiseUpsertFormData, any>,
    'mutationFn'
  >,
) {
  const mutationFn = async (data: FranchiseUpsertFormData): Promise<any> => {
    const url = `upload/${BASE_URL}/docs`;
    const formData = await generateImageFormData(data);

    try {
      return kyInstance.post(url, { body: formData }).json();
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}
