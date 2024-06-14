import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { checkFranchiseByMvPlateNo } from '../api/franchise.api';

import type { Franchise } from '../models/franchise.model';

type Result = {
  loading: boolean;
  mvPlateNo: string;
  refetch: () => void;
  franchise?: Franchise | null;
};

export function useFranchiseChecker(): Result {
  const [searchParams] = useSearchParams();

  const mvPlateNo = useMemo(
    () => searchParams.get('check') || '',
    [searchParams],
  );

  const {
    data: franchise,
    isLoading,
    isFetching,
    refetch,
  } = useQuery(
    checkFranchiseByMvPlateNo(
      { mvPlateNo },
      {
        enabled: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        initialData: undefined,
      },
    ),
  );

  useEffect(() => {
    if (!mvPlateNo.length) return;
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mvPlateNo]);

  return {
    loading: isLoading || isFetching,
    mvPlateNo,
    franchise,
    refetch,
  };
}
