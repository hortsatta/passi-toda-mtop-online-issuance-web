import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { baseIssuerRoute, routeConfig } from '#/config/routes.config';
import { getFranchiseDigest } from '../api/franchise.api';

import type { FranchiseDigest } from '../models/franchise.model';

type Result = {
  franchiseDigest: FranchiseDigest;
  loading: boolean;
  refresh: () => void;
  handleFranchiseDetails: (id: number) => void;
};

const FRANCHISE_LIST_PATH = `/${baseIssuerRoute}/${routeConfig.franchise.to}`;

export function useIssuerFranchiseDigestList(): Result {
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
      navigate(`${FRANCHISE_LIST_PATH}/${id}`);
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
