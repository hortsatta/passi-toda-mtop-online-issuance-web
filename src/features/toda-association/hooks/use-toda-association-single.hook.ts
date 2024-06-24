import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { userBaseTo, routeConfig } from '#/config/routes.config';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { UserRole } from '#/user/models/user.model';
import { getTodaAssociationById as getTodaAssociationByIdApi } from '../api/toda-association.api';

import type { TodaAssociation } from '../models/toda-association.model';

type Result = {
  loading: boolean;
  todaAssociation?: TodaAssociation;
  refresh: () => void;
  handleFranchiseDetails: (id: number) => void;
};

export function useTodaAssociationSingle(withFranchise?: boolean): Result {
  const { id } = useParams();
  const navigate = useNavigate();
  const userRole = useBoundStore((state) => state.user?.role);

  const {
    data: todaAssociation,
    isLoading,
    isFetching,
    refetch,
  } = useQuery(
    getTodaAssociationByIdApi(
      { id: +(id || 0), withFranchise },
      {
        enabled: !!id,
        refetchOnWindowFocus: false,
      },
    ),
  );

  const handleFranchiseDetails = useCallback(
    (id: number) => {
      if (!userRole || userRole === UserRole.Member) return;

      navigate(`${userBaseTo[userRole]}/${routeConfig.franchise.to}/${id}`);
    },
    [userRole, navigate],
  );

  return {
    loading: isLoading || isFetching,
    todaAssociation,
    refresh: refetch,
    handleFranchiseDetails,
  };
}
