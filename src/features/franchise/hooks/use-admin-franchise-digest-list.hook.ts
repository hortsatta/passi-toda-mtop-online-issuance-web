import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { baseAdminRoute, routeConfig } from '#/config/routes.config';
import { getFranchiseDigest } from '../api/franchise.api';

import type { FranchiseDigest } from '../models/franchise.model';

type Result = {
  franchiseDigest: FranchiseDigest;
  loading: boolean;
  refresh: () => void;
  handleFranchiseDetails: (id: number) => void;
};

const FRANCHISE_LIST_TO = `/${baseAdminRoute}/${routeConfig.franchise.to}`;

export function useAdminFranchiseDigestList(): Result {
  const navigate = useNavigate();

  const {
    data: franchiseDigest,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery(
    getFranchiseDigest({
      refetchOnWindowFocus: false,
    }),
  );

  const handleFranchiseDetails = useCallback(
    (id: number) => {
      navigate(`${FRANCHISE_LIST_TO}/${id}`);
    },
    [navigate],
  );

  return {
    franchiseDigest: franchiseDigest || {
      pendingValidations: [],
      pendingPayments: [],
      recentApprovals: [],
      recentRejections: [],
    },
    loading: isLoading || isRefetching,
    refresh: refetch,
    handleFranchiseDetails,
  };
}
