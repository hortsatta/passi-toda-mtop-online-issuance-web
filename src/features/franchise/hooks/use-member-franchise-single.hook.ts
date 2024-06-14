import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryFranchiseKey } from '#/config/react-query-keys.config';
import { FranchiseApprovalStatus } from '../models/franchise.model';
import {
  approveFranchise as approveFranchiseApi,
  getFranchiseById,
} from '../api/franchise.api';

import type { Franchise } from '../models/franchise.model';

type Result = {
  loading: boolean;
  approvalLoading: boolean;
  franchise?: Franchise;
  cancelApplication: () => Promise<Franchise>;
};

export function useMemberFranchiseSingle(): Result {
  const { id } = useParams();

  const {
    data: franchise,
    isLoading,
    isFetching,
  } = useQuery(
    getFranchiseById(
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

  const cancelApplication = useCallback(
    () =>
      mutateAsync({
        id: +(id || 0),
        approvalStatus: FranchiseApprovalStatus.Canceled,
      }),
    [id, mutateAsync],
  );

  return {
    loading: isLoading || isFetching,
    approvalLoading: isPending,
    franchise,
    cancelApplication,
  };
}
