import { useQuery } from '@tanstack/react-query';

import { getFranchiseRateSheetsByFranchiseId } from '../api/rate-sheet.api';

import type { RateSheet } from '../models/rate-sheet.model';

type Result = {
  rateSheets?: RateSheet[];
  loading?: boolean;
};

export function useRateSheetLatestSingle(franchiseId?: number): Result {
  const {
    data: rateSheets,
    isLoading,
    isFetching,
  } = useQuery(
    getFranchiseRateSheetsByFranchiseId(
      {
        franchiseId: franchiseId || 0,
      },
      {
        enabled: !!franchiseId,
        refetchOnWindowFocus: false,
      },
    ),
  );

  return {
    loading: isLoading || isFetching,
    rateSheets,
  };
}
