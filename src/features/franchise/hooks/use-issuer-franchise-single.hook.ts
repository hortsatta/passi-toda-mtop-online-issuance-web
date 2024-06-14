import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryFranchiseKey } from '#/config/react-query-keys.config';
import {
  approveFranchise as approveFranchiseApi,
  getFranchiseById,
} from '../api/franchise.api';

import { Franchise, FranchiseApprovalStatus } from '../models/franchise.model';

type Result = {
  loading: boolean;
  approvalLoading: boolean;
  approveFranchise: (
    approvalStatus?: FranchiseApprovalStatus,
  ) => Promise<Franchise>;
  franchise?: Franchise;
};

export function useIssuerFranchiseSingle(): Result {
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

  const approveFranchise = useCallback(
    (approvalStatus?: FranchiseApprovalStatus) =>
      mutateAsync({ id: +(id || 0), approvalStatus }),
    [id, mutateAsync],
  );

  return {
    loading: isLoading || isFetching,
    approvalLoading: isPending,
    franchise,
    approveFranchise,
  };
}
