import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getAllTodaAssociations } from '../api/toda-association.api';

import type { SelectItem } from '#/core/models/core.model';
import type { TodaAssociation } from '../models/toda-association.model';

type Result = {
  todaAssociations: TodaAssociation[];
  todaAssociationSelectItems: SelectItem[];
  loading?: boolean;
};

export function useTodaAssociationList(): Result {
  const {
    data: todaAssociations,
    isFetching,
    isLoading,
  } = useQuery(
    getAllTodaAssociations(
      {},
      {
        refetchOnWindowFocus: false,
        initialData: [],
      },
    ),
  );

  const todaAssociationSelectItems = useMemo(() => {
    if (todaAssociations == null) return [];
    return todaAssociations.map(({ name, id }) => ({
      value: id,
      label: name,
    }));
  }, [todaAssociations]);

  return {
    loading: isFetching || isLoading,
    todaAssociations: todaAssociations || [],
    todaAssociationSelectItems,
  };
}
