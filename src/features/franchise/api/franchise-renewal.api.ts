import {
  transformToFranchiseRenewal,
  transformToFranchiseRenewalUpsertDto,
  transformToFranchiseRenewalValidateDto,
} from '../helpers/franchise-renewal-transform.helper';

import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { generateApiError } from '#/core/helpers/api.helper';
import { generateImageFormData } from '../helpers/franchise-renewal-form.helper';
import { transformToFranchiseStatusRemarkUpsertDto } from '../helpers/franchise-status-remark-transform.helper';

import type { UseMutationOptions } from '@tanstack/react-query';
import type { FranchiseRenewal } from '../models/franchise-renewal.model';
import type { FranchiseApprovalStatus } from '../models/franchise.model';
import type { FranchiseRenewalUpsertFormData } from '../models/franchise-renewal-form-data.model';
import type { FranchiseStatusRemarkUpsertFormData } from '../models/franchise-status-remark-form-data.model';

const BASE_URL = 'franchise-renewals';
const TREASURER_URL = 'treasurer';

export function validateUpsertFranchiseRenewal(
  options?: Omit<
    UseMutationOptions<
      boolean,
      Error,
      { data: FranchiseRenewalUpsertFormData; id?: number },
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async ({
    data,
    id,
  }: {
    data: FranchiseRenewalUpsertFormData;
    id?: number;
  }): Promise<boolean> => {
    const url = `${BASE_URL}/validate`;
    const json = transformToFranchiseRenewalValidateDto(data);
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

export function createFranchiseRenewal(
  options?: Omit<
    UseMutationOptions<
      FranchiseRenewal,
      Error,
      FranchiseRenewalUpsertFormData,
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async (
    data: FranchiseRenewalUpsertFormData,
  ): Promise<any> => {
    const json = transformToFranchiseRenewalUpsertDto(data);

    try {
      const franchiseRenewal = await kyInstance.post(BASE_URL, { json }).json();
      return transformToFranchiseRenewalUpsertDto(franchiseRenewal);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function editFranchiseRenewal(
  options?: Omit<
    UseMutationOptions<
      FranchiseRenewal,
      Error,
      { id: number; data: FranchiseRenewalUpsertFormData },
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
    data: FranchiseRenewalUpsertFormData;
  }): Promise<any> => {
    const url = `${BASE_URL}/${id}`;
    const json = transformToFranchiseRenewalUpsertDto(data);

    try {
      const franchiseRenewal = await kyInstance.patch(url, { json }).json();
      return transformToFranchiseRenewal(franchiseRenewal);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function approveFranchiseRenewal(
  options?: Omit<
    UseMutationOptions<
      FranchiseRenewal,
      Error,
      {
        id: number;
        data?: {
          approvalStatus?: FranchiseApprovalStatus;
          statusRemarks?: FranchiseStatusRemarkUpsertFormData[];
        };
      },
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
    data?: {
      approvalStatus?: FranchiseApprovalStatus;
      statusRemarks?: FranchiseStatusRemarkUpsertFormData[];
    };
  }): Promise<any> => {
    const url = `${BASE_URL}/approve/${id}`;
    const { approvalStatus, statusRemarks: statusRemarksData } = data || {};
    const statusRemarks = statusRemarksData?.length
      ? transformToFranchiseStatusRemarkUpsertDto(statusRemarksData)
      : undefined;

    try {
      const franchiseRenewal = await kyInstance
        .patch(url, { json: { approvalStatus, statusRemarks } })
        .json();

      return transformToFranchiseRenewal(franchiseRenewal);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function approveTreasurerFranchiseRenewal(
  options?: Omit<
    UseMutationOptions<
      FranchiseRenewal,
      Error,
      {
        id: number;
        paymentORNo: string;
      },
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async ({
    id,
    paymentORNo,
  }: {
    id: number;
    paymentORNo: string;
  }): Promise<any> => {
    const url = `${BASE_URL}/${TREASURER_URL}/approve/${id}`;

    try {
      const franchise = await kyInstance
        .patch(url, { json: { paymentORNo } })
        .json();

      return transformToFranchiseRenewal(franchise);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function deleteFranchiseRenewal(
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

export function uploadFranchiseRenewalFiles(
  options?: Omit<
    UseMutationOptions<
      string[],
      Error,
      { data: FranchiseRenewalUpsertFormData; plateNo: string },
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async ({
    data,
    plateNo,
  }: {
    data: FranchiseRenewalUpsertFormData;
    plateNo: string;
  }): Promise<any> => {
    const url = `upload/${BASE_URL}/docs`;
    const formData = await generateImageFormData(data, plateNo);

    try {
      return kyInstance.post(url, { body: formData }).json();
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}
