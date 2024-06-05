import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { getFranchiseById } from '../api/franchise.api';

import type { Franchise } from '../models/franchise.model';

type Result = {
  loading: boolean;
  franchise?: Franchise;
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

  return { loading: isLoading || isFetching, franchise };
}
