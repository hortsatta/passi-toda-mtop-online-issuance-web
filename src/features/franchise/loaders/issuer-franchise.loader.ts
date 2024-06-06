import { defer } from 'react-router-dom';

import {
  getAllFranchises,
  getFranchiseById,
  getFranchiseDigest,
} from '../api/franchise.api';

import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunctionArgs } from 'react-router-dom';

export function getFranchiseByIdLoader(
  queryClient: QueryClient,
  queryParams?: { exclude?: string; include?: string },
) {
  return async ({ params }: LoaderFunctionArgs) => {
    if (!params?.id) {
      return;
    }

    const keys = { ...queryParams, id: +params.id };
    const query = getFranchiseById(keys);

    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}

export function getFranchisesLoader(queryClient: QueryClient) {
  return async () => {
    const query = getAllFranchises();
    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}

export function getFranchiseDigestLoader(queryClient: QueryClient) {
  return async () => {
    const query = getFranchiseDigest();
    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}
