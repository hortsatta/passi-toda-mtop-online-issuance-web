import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import {
  baseAdminRoute,
  baseIssuerRoute,
  routeConfig,
} from '#/config/routes.config';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { UserRole } from '#/user/models/user.model';
import { getAllTodaAssociations } from '../api/toda-association.api';

import type { QuerySort } from '#/core/models/core.model';
import type { SelectItem } from '#/base/models/base.model';
import type { TodaAssociation } from '../models/toda-association.model';

type Result = {
  todaAssociations: TodaAssociation[];
  todaAssociationSelectItems: SelectItem[];
  refresh: () => void;
  handleTodaAssociationEdit: (id: number) => void;
  handleTodaAssociationDetails: (id: number) => void;
  loading?: boolean;
};

const ADMIN_TODA_ASSOCIATION_LIST_PATH = `/${baseAdminRoute}/${routeConfig.todaAssociation.to}`;
const ISSUER_TODA_ASSOCIATION_LIST_PATH = `/${baseIssuerRoute}/${routeConfig.todaAssociation.to}`;

export const defaultSort = {
  field: 'name',
  order: 'desc' as QuerySort['order'],
};

export const defaultParamKeys = {
  q: undefined,
  status: undefined,
  sort: `${defaultSort.field},${defaultSort.order}`,
  // pagination: { take: PAGINATION_TAKE, skip: 0 },
};

export function useTodaAssociationList(): Result {
  const user = useBoundStore((state) => state.user);
  const navigate = useNavigate();

  const {
    data: todaAssociations,
    isFetching,
    isLoading,
    refetch,
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

  const handleTodaAssociationDetails = useCallback(
    (id: number) => {
      navigate(
        `${user?.role === UserRole.Issuer ? ISSUER_TODA_ASSOCIATION_LIST_PATH : ADMIN_TODA_ASSOCIATION_LIST_PATH}/${id}`,
      );
    },
    [user, navigate],
  );

  const handleTodaAssociationEdit = useCallback(
    (id: number) => {
      navigate(
        `${ADMIN_TODA_ASSOCIATION_LIST_PATH}/${id}/${routeConfig.todaAssociation.edit.to}`,
      );
    },
    [navigate],
  );

  return {
    loading: isFetching || isLoading,
    todaAssociations: todaAssociations || [],
    todaAssociationSelectItems,
    refresh: refetch,
    handleTodaAssociationDetails,
    handleTodaAssociationEdit,
  };
}
