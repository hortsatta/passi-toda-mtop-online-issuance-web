import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import dayjs from '#/config/dayjs.config';
import { getReportFranchiseIssuance } from '../api/report.api';

import type { ReportFranchiseIssuance } from '../models/report.model';
import type { DateRange } from '#/core/models/core.model';

type Result = {
  reportFranchiseIssuance: ReportFranchiseIssuance | null;
  dateRange: DateRange;
  setDateRange: (dateRange: DateRange) => void;
  refresh: () => void;
  loading?: boolean;
};

export const dateRangeOptions = [
  {
    key: 'date-range-month-current',
    name: 'dateRange',
    label: 'This Month',
    value: () => ({
      startDate: dayjs().startOf('month').toDate(),
      endDate: dayjs().endOf('month').toDate(),
    }),
  },
  {
    key: 'date-range-month-last-6',
    name: 'dateRange',
    label: 'Last 6 Months',
    value: () => {
      const date = dayjs();
      return {
        startDate: date.toDate(),
        endDate: date.subtract(6, 'month'),
      };
    },
  },
  {
    key: 'date-range-month-last-12',
    name: 'dateRange',
    label: 'Last 12 Months',
    value: () => {
      const date = dayjs();
      return {
        startDate: date.toDate(),
        endDate: date.subtract(12, 'month'),
      };
    },
  },
  {
    key: 'date-range-month-custom',
    name: 'dateRange',
    label: 'Custom Date',
    value: null,
  },
];

export function useReportFranchiseIssuance(): Result {
  const [dateRange, setDateRange] = useState<DateRange>(
    (dateRangeOptions[0] as any).value() as DateRange,
  );

  const {
    data: reportFranchiseIssuance,
    isFetching,
    isLoading,
    refetch,
  } = useQuery(
    getReportFranchiseIssuance(
      { ...dateRange },
      {
        refetchOnWindowFocus: false,
      },
    ),
  );

  return {
    loading: isFetching || isLoading,
    reportFranchiseIssuance: reportFranchiseIssuance || null,
    dateRange,
    setDateRange,
    refresh: refetch,
  };
}
