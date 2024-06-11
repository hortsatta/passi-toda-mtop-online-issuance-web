import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryTodaAssociationKey } from '#/config/react-query-keys.config';
import { createTodaAssociation as createTodaAssociationApi } from '../api/toda-association.api';

import type { TodaAssociation } from '../models/toda-association.model';
import type { TodaAssociationUpsertFormData } from '../models/toda-association-form-data.model';

type Result = {
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  createTodaAssociation: (
    data: TodaAssociationUpsertFormData,
  ) => Promise<TodaAssociation>;
  loading?: boolean;
};

export function useTodaAssociationCreate(): Result {
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync: mutateCreateTodaAssociation, isPending } = useMutation(
    createTodaAssociationApi({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryTodaAssociationKey.list,
        });
      },
    }),
  );

  const createTodaAssociation = useCallback(
    async (data: TodaAssociationUpsertFormData) => {
      return mutateCreateTodaAssociation(data);
    },
    [mutateCreateTodaAssociation],
  );

  return {
    loading: isPending,
    isDone,
    setIsDone,
    createTodaAssociation,
  };
}
