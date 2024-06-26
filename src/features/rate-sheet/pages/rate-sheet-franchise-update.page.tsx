import { useLoaderData } from 'react-router-dom';

import { baseAdminRoute, routeConfig } from '#/config/routes.config';
import { BaseScene } from '#/base/components/base-scene.component';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseLoading } from '#/base/components/base-loading.component';
import { useRateSheetFranchiseUpdate } from '../hooks/use-rate-sheet-franchise-update.hook';
import { RateSheetFranchiseUpsertForm } from '../components/rate-sheet-franchise-upsert-form.component';
import { useMemo } from 'react';

const FRANCHISE_RATE_SHEET_FEES_TO = `/${baseAdminRoute}/${routeConfig.franchise.to}/${routeConfig.franchise.rates.to}`;

export function RateSheetFranchiseUpdatePage() {
  const {
    loading,
    queryLoading,
    isDone,
    setIsDone,
    rateSheetFormData,
    updateRateSheet,
  } = useRateSheetFranchiseUpdate();

  const data: any = useLoaderData();

  const pageTitle = useMemo(
    () =>
      `${
        rateSheetFormData?.name || routeConfig.franchise.rates.update.pageTitle
      } Update`,
    [rateSheetFormData],
  );

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene pageTitle={pageTitle} backTo={FRANCHISE_RATE_SHEET_FEES_TO}>
        {queryLoading ? (
          <BaseLoading />
        ) : (
          <RateSheetFranchiseUpsertForm
            loading={loading}
            isDone={isDone}
            formData={rateSheetFormData}
            onDone={setIsDone}
            onSubmit={updateRateSheet}
          />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}
