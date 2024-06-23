import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { baseMemberRoute, routeConfig } from '#/config/routes.config';
import { getFranchisesByCurrentMemberUser } from '../api/franchise.api';

import type { Franchise } from '../models/franchise.model';
import type { QueryFilterOption, QuerySort } from '#/core/models/core.model';
import type { ListView } from '#/base/models/base.model';

type Result = {
  franchises: Franchise[];
  loading: boolean;
  listView: ListView;
  // pagination: QueryPagination;
  setKeyword: (keyword: string | null) => void;
  setFilters: (filter: QueryFilterOption[]) => void;
  setSort: (sort: QuerySort) => void;
  refresh: () => void;
  handleFranchiseEdit: (id: number) => void;
  handleFranchiseDetails: (id: number) => void;
  handleListViewChange: () => void;
};

const FRANCHISE_LIST_TO = `/${baseMemberRoute}/${routeConfig.franchise.to}`;

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

export function useMemberFranchiseList(): Result {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState<string | null>(null);
  const [filters, setFilters] = useState<QueryFilterOption[]>([]);
  const [sort, setSort] = useState<QuerySort>(defaultSort);
  const [listView, setListView] = useState<ListView>('strip');

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
    getFranchisesByCurrentMemberUser(
      { q: keyword || undefined, status, sort: querySort },
      {
        refetchOnWindowFocus: false,
      },
    ),
  );

  const handleFranchiseDetails = useCallback(
    (id: number) => {
      navigate(`${FRANCHISE_LIST_TO}/${id}`);
    },
    [navigate],
  );

  const handleListViewChange = useCallback(() => {
    setListView((prev) => (prev === 'strip' ? 'grid' : 'strip'));
  }, []);

  const handleFranchiseEdit = useCallback(
    (id: number) => {
      navigate(`${FRANCHISE_LIST_TO}/${id}/${routeConfig.franchise.edit.to}`);
    },
    [navigate],
  );

  return {
    franchises: franchises || [],
    loading: isLoading || isRefetching,
    listView,
    setKeyword,
    setFilters,
    setSort,
    refresh: refetch,
    handleFranchiseDetails,
    handleFranchiseEdit,
    handleListViewChange,
  };
}
