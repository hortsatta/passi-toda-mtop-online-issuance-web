import { useLoaderData } from 'react-router-dom';

import { routeConfig } from '#/config/routes.config';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseLoading } from '#/base/components/base-loading.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { useRateSheetFranchiseLatestList } from '../hooks/use-rate-sheet-franchise-fees.hook';
import { RateSheetFranchiseList } from '../components/rate-sheet-franchise-list.component';
import { RateSheetListActions } from '../components/rate-sheet-list-actions.component';

export function TreasurerIssuerRateSheetFranchiseFeesPage() {
  const {
    loading,
    selectedHistoryRateSheetsloading,
    registrationRateSheet,
    renewalRateSheet,
    selectedHistoryRateSheets,
    setHistoryFeeType,
    refresh,
  } = useRateSheetFranchiseLatestList();

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene
        pageTitle={routeConfig.franchise.rates.pageTitle}
        rightComponent={<RateSheetListActions onRefresh={refresh} />}
      >
        {loading ? (
          <BaseLoading className='h-full' />
        ) : (
          <RateSheetFranchiseList
            registrationRateSheet={registrationRateSheet}
            renewalRateSheet={renewalRateSheet}
            selectedHistoryRateSheets={selectedHistoryRateSheets}
            selectedHistoryRateSheetsloading={selectedHistoryRateSheetsloading}
            onDetails={setHistoryFeeType}
          />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}
