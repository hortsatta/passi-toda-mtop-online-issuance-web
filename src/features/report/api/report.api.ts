import dayjs from '#/config/dayjs.config';
import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { queryReportKey } from '#/config/react-query-keys.config';
import { generateApiError } from '#/core/helpers/api.helper';
import { transformToReportFranchiseIssuance } from '../helpers/report-transform.helper';

import type { UseQueryOptions } from '@tanstack/react-query';
import type { ReportFranchiseIssuance } from '../models/report.model';

const BASE_URL = 'reports';

export function getReportFranchiseIssuance(
  keys: {
    startDate: Date;
    endDate: Date;
  },
  options?: Omit<
    UseQueryOptions<
      ReportFranchiseIssuance,
      Error,
      ReportFranchiseIssuance,
      any
    >,
    'queryFn' | 'queryKey'
  > & { queryKey?: any },
) {
  const { startDate, endDate } = keys || {};
  const { queryKey, ...moreOptions } = options || {};

  const transformedStartDate = dayjs(startDate).format('YYYY-MM-DD');
  const transformedEndDate = dayjs(endDate).format('YYYY-MM-DD');

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/franchises`;
    const searchParams = generateSearchParams({
      startDate: transformedStartDate,
      endDate: transformedEndDate,
    });

    try {
      const reportFranchiseIssuance = await kyInstance
        .get(url, { searchParams })
        .json();

      return transformToReportFranchiseIssuance(reportFranchiseIssuance);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [
      ...(queryKey?.length ? queryKey : queryReportKey.franchiseIssuance),
      { startDate: transformedStartDate, endDate: transformedEndDate },
    ],
    queryFn,
    ...moreOptions,
  };
}
