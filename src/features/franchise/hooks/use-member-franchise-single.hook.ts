import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import { baseMemberRoute, routeConfig } from '#/config/routes.config';
import { queryClient } from '#/config/react-query-client.config';
import { queryFranchiseKey } from '#/config/react-query-keys.config';
import { FranchiseApprovalStatus } from '../models/franchise.model';
import {
  approveFranchise as approveFranchiseApi,
  getFranchiseById,
} from '../api/franchise.api';
import { approveFranchiseRenewal as approveFranchiseRenewalApi } from '../api/franchise-renewal.api';

import type { Franchise } from '../models/franchise.model';
import type { FranchiseStatusRemarkUpsertFormData } from '../models/franchise-status-remark-form-data.model';

type Result = {
  loading: boolean;
  approvalLoading: boolean;
  franchise?: Franchise;
  cancelApplication: (
    statusRemarks?: FranchiseStatusRemarkUpsertFormData[],
  ) => Promise<Franchise>;
  print: () => void;
  refresh: () => void;
};

const FRANCHISE_TO = `/${baseMemberRoute}/${routeConfig.franchise.to}`;

export function useMemberFranchiseSingle(): Result {
  const { id } = useParams();

  const {
    data: franchise,
    isLoading,
    isFetching,
    refetch: refresh,
  } = useQuery(
    getFranchiseById(
      { id: +(id || 0) },
      {
        enabled: !!id,
        refetchOnWindowFocus: false,
      },
    ),
  );

  const handleApproveSuccess = useCallback(
    () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryFranchiseKey.list,
        }),
        queryClient.invalidateQueries({
          queryKey: queryFranchiseKey.digestList,
        }),
        queryClient.invalidateQueries({
          queryKey: queryFranchiseKey.checkSingle,
        }),
        queryClient.invalidateQueries({
          queryKey: [...queryFranchiseKey.single, { id: id ? +id : undefined }],
        }),
      ]),
    [id],
  );

  const {
    mutateAsync: mutateApproveFranchise,
    isPending: isMutateApproveFranchisePending,
  } = useMutation(
    approveFranchiseApi({
      onSuccess: handleApproveSuccess,
    }),
  );

  const {
    mutateAsync: mutateApproveFranchiseRenewal,
    isPending: isMutateApproveFranchiseRenewalPending,
  } = useMutation(
    approveFranchiseRenewalApi({
      onSuccess: handleApproveSuccess,
    }),
  );

  const cancelApplication = useCallback(
    async (statusRemarks?: FranchiseStatusRemarkUpsertFormData[]) => {
      const franchiseRenewal = franchise?.franchiseRenewals.length
        ? franchise.franchiseRenewals[0]
        : null;

      const data = {
        approvalStatus: FranchiseApprovalStatus.Canceled,
        statusRemarks,
      };

      if (franchiseRenewal) {
        const result = await mutateApproveFranchiseRenewal({
          id: +(franchiseRenewal.id || 0),
          data,
        });

        return {
          ...franchise,
          franchiseRenewals:
            franchise?.franchiseRenewals.map((fr) =>
              fr.id === result.id ? result : fr,
            ) || [],
        } as Franchise;
      }

      return mutateApproveFranchise({
        id: +(id || 0),
        data,
      });
    },
    [id, franchise, mutateApproveFranchise, mutateApproveFranchiseRenewal],
  );

  const print = useCallback(() => {
    if (!franchise) return;
    const url = `${FRANCHISE_TO}/${franchise.id}/${routeConfig.franchise.single.print.to}`;
    window.open(url, '_blank');
  }, [franchise]);

  return {
    loading: isLoading || isFetching,
    approvalLoading:
      isMutateApproveFranchisePending || isMutateApproveFranchiseRenewalPending,
    franchise,
    cancelApplication,
    refresh,
    print,
  };
}
