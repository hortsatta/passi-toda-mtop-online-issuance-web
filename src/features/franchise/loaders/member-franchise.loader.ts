import { defer } from 'react-router-dom';

import {
  getFranchiseById,
  getFranchisesByCurrentMemberUser,
} from '../api/franchise.api';
import { defaultParamKeys } from '../hooks/use-member-franchise-list.hook';

import type { LoaderFunctionArgs } from 'react-router-dom';
import type { QueryClient } from '@tanstack/react-query';

export function getFranchiseByIdLoader(
  queryClient: QueryClient,
  queryParams?: { status?: string; exclude?: string; include?: string },
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
    const query = getFranchisesByCurrentMemberUser(defaultParamKeys);
    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}
