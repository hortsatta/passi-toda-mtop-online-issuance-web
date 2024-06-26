import { defer } from 'react-router-dom';

import {
  getLatestFranchiseRateSheets,
  getRateSheetById,
} from '../api/rate-sheet.api';

import type { LoaderFunctionArgs } from 'react-router-dom';
import type { QueryClient } from '@tanstack/react-query';

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

export function getRateSheetByIdLoader(
  queryClient: QueryClient,
  queryParams?: { exclude?: string; include?: string },
) {
  return async ({ params }: LoaderFunctionArgs) => {
    if (!params?.id) {
      return;
    }

    const keys = { ...queryParams, id: +params.id };
    const query = getRateSheetById(keys);

    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}
