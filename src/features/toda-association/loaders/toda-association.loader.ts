import { defer } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';

import {
  getAllTodaAssociations,
  getTodaAssociationById,
} from '../api/toda-association.api';
import { defaultParamKeys } from '../hooks/use-toda-association-list.hook';

import type { LoaderFunctionArgs } from 'react-router-dom';

export function getTodaAssociationByIdLoader(
  queryClient: QueryClient,
  queryParams?: { status?: string; exclude?: string; include?: string },
) {
  return async ({ params }: LoaderFunctionArgs) => {
    if (!params?.id) {
      return;
    }

    const keys = { ...queryParams, id: +params.id };
    const query = getTodaAssociationById(keys);

    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}

export function getTodaAssociationsLoader(queryClient: QueryClient) {
  return async () => {
    const query = getAllTodaAssociations(defaultParamKeys);
    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}
