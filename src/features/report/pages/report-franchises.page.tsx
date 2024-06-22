import { useCallback, useRef } from 'react';
import { useLoaderData } from 'react-router-dom';

import { routeConfig } from '#/config/routes.config';
import { BaseScene } from '#/base/components/base-scene.component';
import { BaseLoading } from '#/base/components/base-loading.component';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import {
  dateRangeOptions,
  useReportFranchiseIssuance,
} from '../hooks/use-report-franchise-issuance.hook';
import { useReportPrint } from '../hooks/use-report-print.hook';
import { ReportFranchiseIssuanceTable } from '../components/report-franchise-issuance-table.component';
import { ReportFranchisesActions } from '../components/report-franchises-actions.component';

export function ReportFranchisesPage() {
  const { loading, reportFranchiseIssuance, dateRange, setDateRange, refresh } =
    useReportFranchiseIssuance();

  const data: any = useLoaderData();
  const contentRef = useRef(null);

  const getPrintContent = useCallback(() => contentRef.current, []);

  const { print } = useReportPrint({
    content: getPrintContent,
    documentTitle: 'Franchise Report',
  });

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene
        pageTitle={routeConfig.reports.franchises.pageTitle}
        rightComponent={
          <ReportFranchisesActions
            dateRangeOptions={dateRangeOptions}
            defaultSelectedtDateRangeOption={dateRangeOptions[0]}
            dateRange={dateRange}
            onPrint={print}
            onDateRange={setDateRange}
            onRefresh={refresh}
          />
        }
      >
        {loading || !reportFranchiseIssuance ? (
          <BaseLoading className='h-full' />
        ) : (
          <ReportFranchiseIssuanceTable
            ref={contentRef}
            reportFranchiseIssuance={reportFranchiseIssuance}
            dateRange={dateRange}
          />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}
