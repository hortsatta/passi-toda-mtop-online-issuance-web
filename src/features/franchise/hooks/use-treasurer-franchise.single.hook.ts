import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import { baseTreasurerRoute, routeConfig } from '#/config/routes.config';
import { queryClient } from '#/config/react-query-client.config';
import { queryFranchiseKey } from '#/config/react-query-keys.config';
import {
  approveTreasurerFranchise as approveTreasurerFranchiseApi,
  getFranchiseByIdAsTreasurer,
} from '../api/franchise.api';
import { approveTreasurerFranchiseRenewal as approveTreasurerFranchiseRenewalApi } from '../api/franchise-renewal.api';

import type { Franchise } from '../models/franchise.model';

type Result = {
  loading: boolean;
  approvalLoading: boolean;
  franchise?: Franchise;
  approveFranchise: (paymentORNo: string) => Promise<Franchise>;
  print: () => void;
  refresh: () => void;
};

const FRANCHISE_TO = `/${baseTreasurerRoute}/${routeConfig.franchise.to}`;

export function useTreasurerFranchiseSingle(): Result {
  const { id } = useParams();

  const {
    data: franchise,
    isLoading,
    isFetching,
    refetch: refresh,
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
    approveFranchise,
    print,
    refresh,
  };
}
