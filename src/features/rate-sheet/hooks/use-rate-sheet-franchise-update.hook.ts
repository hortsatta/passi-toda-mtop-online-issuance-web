import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryRateSheetKey } from '#/config/react-query-keys.config';
import { transformToRateSheetFormData } from '../helpers/rate-sheet-transform.helper';
import {
  createFranchiseRateSheet,
  getRateSheetById,
} from '../api/rate-sheet.api';

import type { RateSheet } from '../models/rate-sheet.model';
import type { RateSheetUpsertFormData } from '../models/rate-sheet-form-data.model';

type Result = {
  loading: boolean;
  queryLoading: boolean;
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  rateSheetFormData: RateSheetUpsertFormData | undefined;
  updateRateSheet: (data: RateSheetUpsertFormData) => Promise<RateSheet>;
};

export function useRateSheetFranchiseUpdate(): Result {
  const { id } = useParams();
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync: mutateCreateRateSheet, isPending } = useMutation(
    createFranchiseRateSheet({
      onSuccess: () =>
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: queryRateSheetKey.list,
          }),
          queryClient.invalidateQueries({
            queryKey: queryRateSheetKey.historyList,
          }),
          queryClient.invalidateQueries({
            queryKey: queryRateSheetKey.latestSingle,
          }),
        ]),
    }),
  );

  const {
    data: rateSheet,
    isLoading: isQueryLoading,
    isFetching: isQueryFetching,
  } = useQuery(
    getRateSheetById(
      { id: id ? +id : 0 },
      {
        enabled: !!id,
        refetchOnWindowFocus: false,
      },
    ),
  );

  const rateSheetFormData = useMemo(
    () => (rateSheet ? transformToRateSheetFormData(rateSheet) : undefined),
    [rateSheet],
  );

  const updateRateSheet = useCallback(
    async (data: RateSheetUpsertFormData) => {
      return mutateCreateRateSheet(data);
    },
    [mutateCreateRateSheet],
  );

  return {
    loading: isPending,
    queryLoading: isQueryLoading || isQueryFetching,
    isDone,
    setIsDone,
    rateSheetFormData,
    updateRateSheet,
  };
}
