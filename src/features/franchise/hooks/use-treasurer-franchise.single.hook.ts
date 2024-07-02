import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryFranchiseKey } from '#/config/react-query-keys.config';
import {
  approveFranchise as approveFranchiseApi,
  getFranchiseByIdAsTreasurer,
} from '../api/franchise.api';
import { approveFranchiseRenewal as approveFranchiseRenewalApi } from '../api/franchise-renewal.api';

import { Franchise, FranchiseApprovalStatus } from '../models/franchise.model';

type Result = {
  loading: boolean;
  approvalLoading: boolean;
  approveFranchise: () => Promise<Franchise>;
  franchise?: Franchise;
};

export function useTreasurerFranchiseSingle(): Result {
  const { id } = useParams();

  const {
    data: franchise,
    isLoading,
    isFetching,
  } = useQuery(
    getFranchiseByIdAsTreasurer(
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

  const approveFranchise = useCallback(async () => {
    const franchiseRenewal = franchise?.franchiseRenewals.length
      ? franchise.franchiseRenewals[0]
      : null;

    if (franchiseRenewal) {
      const result = await mutateApproveFranchiseRenewal({
        id: +(franchiseRenewal.id || 0),
        approvalStatus: FranchiseApprovalStatus.Paid,
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
      approvalStatus: FranchiseApprovalStatus.Paid,
    });
  }, [id, franchise, mutateApproveFranchise, mutateApproveFranchiseRenewal]);

  return {
    loading: isLoading || isFetching,
    approvalLoading:
      isMutateApproveFranchisePending || isMutateApproveFranchiseRenewalPending,
    franchise,
    approveFranchise,
  };
}
