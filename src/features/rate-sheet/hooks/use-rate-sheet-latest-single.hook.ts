import { useQuery } from '@tanstack/react-query';

import { FranchiseApprovalStatus } from '#/franchise/models/franchise.model';
import { getLatestRateSheetByType } from '../api/rate-sheet.api';
import { FeeType } from '../models/rate-sheet.model';

import type { RateSheet } from '../models/rate-sheet.model';

type Result = {
  rateSheet?: RateSheet;
  loading?: boolean;
};

export function useRateSheetLatestSingle(
  approvalStatus?: FranchiseApprovalStatus,
): Result {
  const {
    data: rateSheet,
    isLoading,
    isFetching,
  } = useQuery(
    getLatestRateSheetByType(
      {
        type:
          approvalStatus === FranchiseApprovalStatus.Approved
            ? FeeType.FranchiseRenewal
            : FeeType.FranchiseRegistration,
      },
      {
        enabled: !!approvalStatus,
        refetchOnWindowFocus: false,
      },
    ),
  );

  return {
    loading: isLoading || isFetching,
    rateSheet,
  };
}
