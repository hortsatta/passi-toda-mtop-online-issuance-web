import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryFranchiseKey } from '#/config/react-query-keys.config';
import {
  approveTreasurerFranchise as approveTreasurerFranchiseApi,
  getFranchiseByIdAsTreasurer,
} from '../api/franchise.api';
import { approveTreasurerFranchiseRenewal as approveTreasurerFranchiseRenewalApi } from '../api/franchise-renewal.api';

import { Franchise } from '../models/franchise.model';

type Result = {
  loading: boolean;
  approvalLoading: boolean;
  approveFranchise: (paymentORNo: string) => Promise<Franchise>;
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
    approveTreasurerFranchiseApi({
      onSuccess: handleApproveSuccess,
    }),
  );

  const {
    mutateAsync: mutateApproveFranchiseRenewal,
    isPending: isMutateApproveFranchiseRenewalPending,
  } = useMutation(
    approveTreasurerFranchiseRenewalApi({
      onSuccess: handleApproveSuccess,
    }),
  );

  const approveFranchise = useCallback(
    async (paymentORNo: string) => {
      const franchiseRenewal = franchise?.franchiseRenewals.length
        ? franchise.franchiseRenewals[0]
        : null;

      if (franchiseRenewal) {
        const result = await mutateApproveFranchiseRenewal({
          id: +(franchiseRenewal.id || 0),
          paymentORNo,
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
        paymentORNo,
      });
    },
    [id, franchise, mutateApproveFranchise, mutateApproveFranchiseRenewal],
  );

  return {
    loading: isLoading || isFetching,
    approvalLoading:
      isMutateApproveFranchisePending || isMutateApproveFranchiseRenewalPending,
    franchise,
    approveFranchise,
  };
}
