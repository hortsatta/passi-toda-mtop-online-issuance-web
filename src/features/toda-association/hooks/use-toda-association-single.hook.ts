import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { getTodaAssociationById as getTodaAssociationByIdApi } from '../api/toda-association.api';

import type { TodaAssociation } from '../models/toda-association.model';

type Result = {
  loading: boolean;
  todaAssociation?: TodaAssociation;
};

export function useTodaAssociationSingle(): Result {
  const { id } = useParams();

  const {
    data: todaAssociation,
    isLoading,
    isFetching,
  } = useQuery(
    getTodaAssociationByIdApi(
      { id: +(id || 0) },
      {
        enabled: !!id,
        refetchOnWindowFocus: false,
      },
    ),
  );

  return {
    loading: isLoading || isFetching,
    todaAssociation,
  };
}
