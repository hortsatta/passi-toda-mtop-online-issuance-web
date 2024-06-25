import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { baseAdminRoute, routeConfig } from '#/config/routes.config';
import { FeeType } from '../models/rate-sheet.model';
import {
  getLatestFranchiseRateSheets,
  getRateSheetHistory,
} from '../api/rate-sheet.api';

import type { RateSheet } from '../models/rate-sheet.model';

type Result = {
  registrationRateSheet?: RateSheet;
  renewalRateSheet?: RateSheet;
  selectedHistoryRateSheets?: RateSheet[];
  loading: boolean;
  selectedHistoryRateSheetsloading: boolean;
  setHistoryFeeType: (feeType: FeeType | null) => void;
  handleRateSheetUpdate: (id: number) => void;
  refresh: () => void;
  selectedHistoryRateSheetsRefresh: () => void;
};

const FRANCHISE_RATE_SHEET_UPDATE = `/${baseAdminRoute}/${routeConfig.franchise.to}/${routeConfig.franchise.rates.to}`;

export function useRateSheetFranchiseLatestList(): Result {
  const navigate = useNavigate();
  const [historyFeeType, setHistoryFeeType] = useState<FeeType | null>(null);

  const {
    data: rateSheets,
    isFetching,
    isLoading,
    refetch,
  } = useQuery(
    getLatestFranchiseRateSheets({
      refetchOnWindowFocus: false,
      initialData: [],
    }),
  );

  const {
    data: selectedHistoryRateSheets,
    isFetching: isSelectedHistoryRateSheetsFetching,
    isLoading: isSelectedHistoryRateSheetsLoading,
    refetch: selectedHistoryRateSheetsRefresh,
  } = useQuery(
    getRateSheetHistory(
      { type: historyFeeType || FeeType.FranchiseRegistration },
      {
        enabled: false,
        refetchOnWindowFocus: false,
        initialData: [],
      },
    ),
  );

  const [registrationRateSheet, renewalRateSheet] = useMemo(
    () => [
      rateSheets?.find(
        (rateSheet) => rateSheet.feeType === FeeType.FranchiseRegistration,
      ),
      rateSheets?.find(
        (rateSheet) => rateSheet.feeType === FeeType.FranchiseRenewal,
      ),
    ],
    [rateSheets],
  );

  const handleRateSheetUpdate = useCallback(
    (id: number) => {
      const to = `${FRANCHISE_RATE_SHEET_UPDATE}/${id}/${routeConfig.franchise.rates.edit.to}`;
      navigate(to);
    },
    [navigate],
  );

  useEffect(() => {
    if (!historyFeeType) return;
    selectedHistoryRateSheetsRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyFeeType]);

  return {
    loading: isFetching || isLoading,
    selectedHistoryRateSheetsloading:
      isSelectedHistoryRateSheetsFetching || isSelectedHistoryRateSheetsLoading,
    registrationRateSheet,
    renewalRateSheet,
    selectedHistoryRateSheets,
    setHistoryFeeType,
    handleRateSheetUpdate,
    refresh: refetch,
    selectedHistoryRateSheetsRefresh,
  };
}
