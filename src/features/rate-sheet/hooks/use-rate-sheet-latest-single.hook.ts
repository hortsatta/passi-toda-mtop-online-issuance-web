import { useQuery } from '@tanstack/react-query';

import { getLatestRateSheet } from '../api/rate-sheet.api';

import type { RateSheet } from '../models/rate-sheet.model';

type Result = {
  rateSheet?: RateSheet;
  loading?: boolean;
};

export function useRateSheetLatestSingle(): Result {
  const {
    data: rateSheet,
    isLoading,
    isFetching,
  } = useQuery(
    getLatestRateSheet(
      {},
      {
        refetchOnWindowFocus: false,
      },
    ),
  );

  return {
    loading: isLoading || isFetching,
    rateSheet,
  };
}
