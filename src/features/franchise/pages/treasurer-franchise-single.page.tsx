import { useLoaderData } from 'react-router-dom';

import { baseTreasurerRoute, routeConfig } from '#/config/routes.config';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseLoading } from '#/base/components/base-loading.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { useRateSheetLatestSingle } from '#/rate-sheet/hooks/use-rate-sheet-latest-single.hook';
import { useTreasurerFranchiseSingle } from '../hooks/use-treasurer-franchise.single.hook';
import { TreasurerFranchiseSingle } from '../components/treasurer-franchise-single.component';
import { FranchiseSingleActions } from '../components/franchise-single-actions.component';

const FRANCHISE_LIST_TO = `/${baseTreasurerRoute}/${routeConfig.franchise.to}`;

export function TreasurerFranchiseSinglePage() {
  const {
    franchise,
    loading,
    approvalLoading,
    approveFranchise,
    refresh,
    print,
  } = useTreasurerFranchiseSingle();

  const { rateSheets, loading: rateSheetLoading } = useRateSheetLatestSingle(
    franchise?.id,
  );

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene
        pageTitle={routeConfig.franchise.single.pageTitle}
        backTo={FRANCHISE_LIST_TO}
        rightComponent={
          <FranchiseSingleActions onPrint={print} onRefresh={refresh} />
        }
      >
        {(loading || rateSheetLoading) && <BaseLoading />}
        {franchise && rateSheets && (
          <TreasurerFranchiseSingle
            loading={approvalLoading}
            franchise={franchise}
            rateSheets={rateSheets}
            onApproveFranchise={approveFranchise}
          />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}
