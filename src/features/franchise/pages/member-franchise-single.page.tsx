import { useLoaderData } from 'react-router-dom';

import { baseAdminRoute, routeConfig } from '#/config/routes.config';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { BaseLoading } from '#/base/components/base-loading.component';
import { useRateSheetLatestSingle } from '#/rate-sheet/hooks/use-rate-sheet-latest-single.hook';
import { useMemberFranchiseSingle } from '../hooks/use-member-franchise-single.hook';
import { MemberFranchiseSingle } from '../components/member-franchise-single.component';

const FRANCHISE_LIST_PATH = `/${baseAdminRoute}/${routeConfig.franchise.to}`;

export function MemberFranchiseSinglePage() {
  const { franchise, loading, approvalLoading, cancelApplication } =
    useMemberFranchiseSingle();

  const { rateSheet, loading: rateSheetLoading } = useRateSheetLatestSingle(
    franchise?.approvalStatus,
  );

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene pageTitle='Franchise' backTo={FRANCHISE_LIST_PATH}>
        {(loading || rateSheetLoading) && <BaseLoading />}
        {franchise && rateSheet && (
          <MemberFranchiseSingle
            loading={approvalLoading}
            franchise={franchise}
            rateSheet={rateSheet}
            onCancelApplication={cancelApplication}
          />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}
