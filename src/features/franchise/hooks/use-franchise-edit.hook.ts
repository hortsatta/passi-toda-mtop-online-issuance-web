import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryFranchiseKey } from '#/config/react-query-keys.config';
import {
  editFranchise as editFranchiseApi,
  deleteFranchise as deleteFranchiseApi,
  getFranchiseById,
} from '../api/franchise.api';
import { transformToFranchiseFormData } from '../helpers/franchise-transform.helper';

import type { Franchise } from '../models/franchise.model';
import type { FranchiseUpsertFormData } from '../models/franchise-form-data.model';

type Result = {
  loading: boolean;
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  franchiseFormData: FranchiseUpsertFormData | undefined;
  editFranchise: (data: FranchiseUpsertFormData) => Promise<Franchise>;
  deleteFranchise: () => Promise<boolean>;
};

export function useFranchiseEdit(id?: number): Result {
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync: mutateEditFranchise, isPending } = useMutation(
    editFranchiseApi({
      onSuccess: (data) =>
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: queryFranchiseKey.list,
          }),
          queryClient.invalidateQueries({
            queryKey: [
              ...queryFranchiseKey.single,
              { id: data?.id ? +data?.id : undefined },
            ],
          }),
        ]),
    }),
  );

  const { mutateAsync: mutateDeleteFranchise, isPending: isDeletePending } =
    useMutation(
      deleteFranchiseApi({
        onSuccess: () =>
          Promise.all([
            queryClient.invalidateQueries({
              queryKey: queryFranchiseKey.list,
            }),
            queryClient.invalidateQueries({
              queryKey: [
                ...queryFranchiseKey.single,
                { id: id ? +id : undefined },
              ],
            }),
          ]),
      }),
    );

  const {
    data: franchise,
    isLoading: isQueryLoading,
    isFetching: isQueryFetching,
  } = useQuery(
    getFranchiseById(
      { id: id || 0 },
      {
        enabled: !!id,
        refetchOnWindowFocus: false,
      },
    ),
  );

  const franchiseFormData = useMemo(
    () => (franchise ? transformToFranchiseFormData(franchise) : undefined),
    [franchise],
  );

  const loading = useMemo(
    () => isPending || isDeletePending || isQueryLoading || isQueryFetching,
    [isPending, isDeletePending, isQueryLoading, isQueryFetching],
  );

  const editFranchise = useCallback(
    async (data: FranchiseUpsertFormData) => {
      const updatedFranchise = await mutateEditFranchise({
        id: id || 0,
        data,
      });
      return updatedFranchise;
    },
    [id, mutateEditFranchise],
  );

  const deleteFranchise = useCallback(async () => {
    if (!id) {
      return false;
    }

    return mutateDeleteFranchise(id);
  }, [id, mutateDeleteFranchise]);

  return {
    loading,
    isDone,
    setIsDone,
    franchiseFormData,
    editFranchise,
    deleteFranchise,
  };
}
