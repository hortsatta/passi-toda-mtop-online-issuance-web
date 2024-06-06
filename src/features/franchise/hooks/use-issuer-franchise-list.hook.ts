import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { baseIssuerRoute, routeConfig } from '#/config/routes.config';
import { getAllFranchises } from '../api/franchise.api';

import type { QueryFilterOption, QuerySort } from '#/core/models/core.model';
import type { Franchise } from '../models/franchise.model';

type Result = {
  franchises: Franchise[];
  loading: boolean;
  // pagination: QueryPagination;
  setKeyword: (keyword: string | null) => void;
  setFilters: (filter: QueryFilterOption[]) => void;
  setSort: (sort: QuerySort) => void;
  refresh: () => void;
  handleFranchiseDetails: (id: number) => void;
};

const FRANCHISE_LIST_PATH = `/${baseIssuerRoute}/${routeConfig.franchise.to}`;

export const defaultSort = {
  field: 'createdAt',
  order: 'desc' as QuerySort['order'],
};

export const defaultParamKeys = {
  q: undefined,
  status: undefined,
  sort: `${defaultSort.field},${defaultSort.order}`,
  // pagination: { take: PAGINATION_TAKE, skip: 0 },
};

export function useIssuerFranchiseList(): Result {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState<string | null>(null);
  const [filters, setFilters] = useState<QueryFilterOption[]>([]);
  const [sort, setSort] = useState<QuerySort>(defaultSort);

  const status = useMemo(() => {
    if (!filters.length) {
      return undefined;
    }

    return filters
      .filter((f) => f.name === 'status')
      .map((f) => f.value)
      .join(',');
  }, [filters]);

  const querySort = useMemo(() => `${sort.field},${sort.order}`, [sort]);

  const {
    data: franchises,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery(
    getAllFranchises(
      { q: keyword || undefined, status, sort: querySort },
      {
        refetchOnWindowFocus: false,
      },
    ),
  );

  const handleFranchiseDetails = useCallback(
    (id: number) => {
      navigate(`${FRANCHISE_LIST_PATH}/${id}`);
    },
    [navigate],
  );

  return {
    franchises: franchises || [],
    loading: isLoading || isRefetching,
    setKeyword,
    setFilters,
    setSort,
    refresh: refetch,
    handleFranchiseDetails,
  };
}
