import { useState, useMemo, useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryTodaAssociationKey } from '#/config/react-query-keys.config';
import { transformToTodaAssociationFormData } from '../helpers/toda-association-transform.helper';
import {
  editTodaAssociation as editTodaAssociationApi,
  deleteTodaAssociation as deleteTodaAssociationApi,
  getTodaAssociationById,
} from '../api/toda-association.api';

import type { TodaAssociation } from '../models/toda-association.model';
import type { TodaAssociationUpsertFormData } from '../models/toda-association-form-data.model';

type Result = {
  loading: boolean;
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  todaAssociationFormData: TodaAssociationUpsertFormData | undefined;
  editTodaAssociation: (
    data: TodaAssociationUpsertFormData,
  ) => Promise<TodaAssociation>;
  deleteTodaAssociation: () => Promise<boolean>;
};

export function useTodaAssociationEdit(id?: number): Result {
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync: mutateEditTodaAssociation, isPending } = useMutation(
    editTodaAssociationApi({
      onSuccess: (data) =>
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: queryTodaAssociationKey.list,
          }),
          queryClient.invalidateQueries({
            queryKey: [
              ...queryTodaAssociationKey.single,
              { id: data?.id ? +data?.id : undefined },
            ],
          }),
        ]),
    }),
  );

  const {
    mutateAsync: mutateDeleteTodaAssociation,
    isPending: isDeletePending,
  } = useMutation(
    deleteTodaAssociationApi({
      onSuccess: () =>
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: queryTodaAssociationKey.list,
          }),
          queryClient.invalidateQueries({
            queryKey: [
              ...queryTodaAssociationKey.single,
              { id: id ? +id : undefined },
            ],
          }),
        ]),
    }),
  );

  const {
    data: todaAssociation,
    isLoading: isQueryLoading,
    isFetching: isQueryFetching,
  } = useQuery(
    getTodaAssociationById(
      { id: id || 0 },
      {
        enabled: !!id,
        refetchOnWindowFocus: false,
      },
    ),
  );

  const todaAssociationFormData = useMemo(
    () =>
      todaAssociation
        ? transformToTodaAssociationFormData(todaAssociation)
        : undefined,
    [todaAssociation],
  );

  const loading = useMemo(
    () => isPending || isDeletePending || isQueryLoading || isQueryFetching,
    [isPending, isDeletePending, isQueryLoading, isQueryFetching],
  );

  const editTodaAssociation = useCallback(
    async (data: TodaAssociationUpsertFormData) => {
      const updatedTodaAssociation = await mutateEditTodaAssociation({
        id: id || 0,
        data,
      });
      return updatedTodaAssociation;
    },
    [id, mutateEditTodaAssociation],
  );

  const deleteTodaAssociation = useCallback(async () => {
    if (!id) {
      return false;
    }

    return mutateDeleteTodaAssociation(id);
  }, [id, mutateDeleteTodaAssociation]);

  return {
    loading,
    isDone,
    setIsDone,
    todaAssociationFormData,
    editTodaAssociation,
    deleteTodaAssociation,
  };
}
