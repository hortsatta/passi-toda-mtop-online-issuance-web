import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryFranchiseKey } from '#/config/react-query-keys.config';
import {
  approveFranchise as approveFranchiseApi,
  getFranchiseByIdAsTreasurer,
} from '../api/franchise.api';

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

  const { mutateAsync, isPending } = useMutation(
    approveFranchiseApi({
      onSuccess: () =>
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
            queryKey: [
              ...queryFranchiseKey.single,
              { id: id ? +id : undefined },
            ],
          }),
        ]),
    }),
  );

  const approveFranchise = useCallback(
    () =>
      mutateAsync({
        id: +(id || 0),
        approvalStatus: FranchiseApprovalStatus.Paid,
      }),
    [id, mutateAsync],
  );

  return {
    loading: isLoading || isFetching,
    approvalLoading: isPending,
    franchise,
    approveFranchise,
  };
}
