import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getAllMemberDriverProfiles } from '../api/driver-profile.api';

import type { QuerySort } from '#/core/models/core.model';
import type { DriverProfile } from '../models/driver-profile.model';

type Result = {
  driverProfiles: DriverProfile[];
  setKeyword: (keyword: string | null) => void;
  refresh: () => void;
  loading?: boolean;
};

export const defaultSort = {
  field: 'firstName',
  order: 'desc' as QuerySort['order'],
};

export const defaultParamKeys = {
  q: undefined,
  status: undefined,
  sort: `${defaultSort.field},${defaultSort.order}`,
  // pagination: { take: PAGINATION_TAKE, skip: 0 },
};

export function useDriverProfileList(): Result {
  const [keyword, setKeyword] = useState<string | null>(null);

  const {
    data: driverProfiles,
    isFetching,
    isLoading,
    refetch,
  } = useQuery(
    getAllMemberDriverProfiles(
      { q: keyword || undefined },
      {
        refetchOnWindowFocus: false,
        initialData: [],
      },
    ),
  );

  return {
    loading: isFetching || isLoading,
    driverProfiles: driverProfiles || [],
    setKeyword,
    refresh: refetch,
  };
}
