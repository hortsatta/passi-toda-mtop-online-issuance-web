import { useLoaderData } from 'react-router-dom';

import { routeConfig } from '#/config/routes.config';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { BaseLoading } from '#/base/components/base-loading.component';
import { useRateSheetFranchiseLatestList } from '../hooks/use-rate-sheet-franchise-fees.hook';
import { RateSheetListActions } from '../components/rate-sheet-list-actions.component';
import { RateSheetFranchiseList } from '../components/rate-sheet-franchise-list.component';

export function AdminRateSheetFranchiseFeesPage() {
  const {
    loading,
    selectedHistoryRateSheetsloading,
    registrationRateSheet,
    renewalRateSheet,
    selectedHistoryRateSheets,
    setHistoryFeeType,
    handleRateSheetUpdate,
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
            onRateSheetUpdate={handleRateSheetUpdate}
          />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}
