import { useLoaderData } from 'react-router-dom';

import { baseMemberRoute, routeConfig } from '#/config/routes.config';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { BaseLoading } from '#/base/components/base-loading.component';
import { useRateSheetLatestSingle } from '#/rate-sheet/hooks/use-rate-sheet-latest-single.hook';
import { useMemberFranchiseSingle } from '../hooks/use-member-franchise-single.hook';
import { MemberFranchiseSingle } from '../components/member-franchise-single.component';
import { FranchiseSingleActions } from '../components/franchise-single-actions.component';

const FRANCHISE_LIST_TO = `/${baseMemberRoute}/${routeConfig.franchise.to}`;

export function MemberFranchiseSinglePage() {
  const {
    franchise,
    loading,
    approvalLoading,
    cancelApplication,
    refresh,
    print,
  } = useMemberFranchiseSingle();

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
          <MemberFranchiseSingle
            loading={approvalLoading}
            franchise={franchise}
            rateSheets={rateSheets}
            onCancelApplication={cancelApplication}
          />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}
