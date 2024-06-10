import { useQuery } from '@tanstack/react-query';

import { getLatestFranchiseRateSheets } from '../api/rate-sheet.api';

import type { RateSheet } from '../models/rate-sheet.model';

type Result = {
  rateSheets: RateSheet[];
  loading?: boolean;
};

export function useRateSheetLatestList(): Result {
  const {
    data: rateSheets,
    isLoading,
    isFetching,
  } = useQuery(
    getLatestFranchiseRateSheets({
      refetchOnWindowFocus: false,
    }),
  );

  return {
    loading: isLoading || isFetching,
    rateSheets: rateSheets || [],
  };
}
