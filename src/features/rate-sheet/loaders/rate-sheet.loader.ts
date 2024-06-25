import { defer } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';

import { getLatestFranchiseRateSheets } from '../api/rate-sheet.api';

export function getLatestFranchiseRateSheetsLoader(queryClient: QueryClient) {
  return async () => {
    const query = getLatestFranchiseRateSheets();
    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}
