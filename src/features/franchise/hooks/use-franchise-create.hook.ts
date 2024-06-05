import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryFranchiseKey } from '#/config/react-query-keys.config';
import { createFranchise as createFranchiseApi } from '../api/franchise.api';

import type { FranchiseUpsertFormData } from '../models/franchise-form-data.model';
import type { Franchise } from '../models/franchise.model';

type Result = {
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  createFranchise: (data: FranchiseUpsertFormData) => Promise<Franchise>;
  loading?: boolean;
};

export function useFranchiseCreate(): Result {
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync: createFranchise } = useMutation(
    createFranchiseApi({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryFranchiseKey.list,
        });
      },
    }),
  );

  return {
    isDone,
    setIsDone,
    createFranchise,
  };
}
