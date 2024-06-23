import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { routeConfig, userBaseTo } from '#/config/routes.config';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { UserRole } from '#/user/models/user.model';
import { FranchiseApprovalStatus } from '../models/franchise.model';
import { getAllFranchises, getFranchiseDigest } from '../api/franchise.api';

import type { QueryFilterOption, QuerySort } from '#/core/models/core.model';
import type { ListView } from '#/base/models/base.model';
import type { Franchise, FranchiseDigest } from '../models/franchise.model';

type Result = {
  franchiseDigest: FranchiseDigest;
  franchises: Franchise[];
  loading: boolean;
  isFiltered: boolean;
  filterOptions: QueryFilterOption[];
  listView: ListView;
  // pagination: QueryPagination;
  setKeyword: (keyword: string | null) => void;
  setFilters: (filter: QueryFilterOption[]) => void;
  setSort: (sort: QuerySort) => void;
  refresh: () => void;
  handleFranchiseDetails: (id: number) => void;
  handleListViewChange: () => void;
};

export const issuerAdminFilterOptions = [
  {
    key: 'status-pending-validation',
    name: 'status',
    value: FranchiseApprovalStatus.PendingValidation,
    label: 'Pending Validation',
  },
  {
    key: 'status-validated',
    name: 'status',
    value: FranchiseApprovalStatus.Validated,
    label: 'Validated',
  },
  {
    key: 'status-paid',
    name: 'status',
    value: FranchiseApprovalStatus.Paid,
    label: 'Paid',
  },
  {
    key: 'status-approved',
    name: 'status',
    value: FranchiseApprovalStatus.Approved,
    label: 'Approved',
  },
  {
    key: 'status-rejected',
    name: 'status',
    value: FranchiseApprovalStatus.Rejected,
    label: 'Rejected',
  },
  {
    key: 'status-canceled',
    name: 'status',
    value: FranchiseApprovalStatus.Canceled,
    label: 'Canceled',
  },
];

export const treasurerFilterOptions = [
  issuerAdminFilterOptions.find((option) => option.key === 'status-validated'),
  issuerAdminFilterOptions.find((option) => option.key === 'status-paid'),
] as QueryFilterOption[];

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

export function useTIAFranchiseList(): Result {
  const navigate = useNavigate();
  const userRole = useBoundStore((state) => state.user?.role);
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
    data: franchiseDigest,
    isLoading: isFranchiseDigestLoading,
    isRefetching: isFranchiseDigestRefetching,
    refetch: franchiseDigestRefetch,
  } = useQuery(
    getFranchiseDigest({
      enabled: !filters.length && !keyword?.trim().length,
      refetchOnWindowFocus: false,
    }),
  );

  const {
    data: franchises,
    isLoading: isFranchiseListLoading,
    isRefetching: isFranchiseListRefetching,
    refetch: franchiseListRefetch,
  } = useQuery(
    getAllFranchises(
      { q: keyword || undefined, status, sort: querySort },
      {
        enabled: !!filters.length || !!keyword?.trim().length,
        refetchOnWindowFocus: false,
      },
    ),
  );

  const filterOptions = useMemo(
    () =>
      userRole === UserRole.Treasurer
        ? treasurerFilterOptions
        : issuerAdminFilterOptions,
    [userRole],
  );

  const handleFranchiseDetails = useCallback(
    (id: number) => {
      if (!userRole || userRole === UserRole.Member) return;

      navigate(`${userBaseTo[userRole]}/${routeConfig.franchise.to}/${id}`);
    },
    [userRole, navigate],
  );

  const handleListViewChange = useCallback(() => {
    setListView((prev) => (prev === 'strip' ? 'grid' : 'strip'));
  }, []);

  const refresh = useCallback(() => {
    !filters.length ? franchiseDigestRefetch() : franchiseListRefetch();
  }, [filters, franchiseDigestRefetch, franchiseListRefetch]);

  return {
    franchiseDigest: franchiseDigest || {
      pendingValidations: [],
      validatedList: [],
      paidList: [],
      recentApprovals: [],
      recentRejections: [],
    },
    franchises: franchises || [],
    loading:
      isFranchiseDigestLoading ||
      isFranchiseListLoading ||
      isFranchiseListRefetching ||
      isFranchiseDigestRefetching,
    isFiltered: !!filters.length || !!keyword?.trim().length,
    listView,
    filterOptions,
    setKeyword,
    setFilters,
    setSort,
    refresh,
    handleFranchiseDetails,
    handleListViewChange,
  };
}
