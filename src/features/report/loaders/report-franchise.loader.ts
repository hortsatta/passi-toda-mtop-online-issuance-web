import { defer } from 'react-router-dom';

import dayjs from '#/config/dayjs.config';
import { getReportFranchiseIssuance } from '../api/report.api';

import type { QueryClient } from '@tanstack/react-query';

export function getReportFranchiseIssuanceLoader(
  queryClient: QueryClient,
) {
  return async () => {
    const query = getReportFranchiseIssuance({
      startDate: dayjs().startOf('month').toDate(),
      endDate: dayjs().endOf('month').toDate(),
    });
    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}