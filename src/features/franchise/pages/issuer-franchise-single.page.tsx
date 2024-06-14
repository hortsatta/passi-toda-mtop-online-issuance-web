import { useLoaderData } from 'react-router-dom';

import { baseIssuerRoute, routeConfig } from '#/config/routes.config';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseLoading } from '#/base/components/base-loading.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { useRateSheetLatestSingle } from '#/rate-sheet/hooks/use-rate-sheet-latest-single.hook';
import { useIssuerFranchiseSingle } from '../hooks/use-issuer-franchise-single.hook';
import { IssuerFranchiseSingle } from '../components/issuer-franchise-single.component';

const FRANCHISE_LIST_TO = `/${baseIssuerRoute}/${routeConfig.franchise.to}`;

export function IssuerFranchiseSinglePage() {
  const { franchise, loading, approvalLoading, approveFranchise } =
    useIssuerFranchiseSingle();

  const { rateSheet, loading: rateSheetLoading } = useRateSheetLatestSingle(
    franchise?.approvalStatus,
  );

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene
        pageTitle={routeConfig.franchise.single.pageTitle}
        backTo={FRANCHISE_LIST_TO}
      >
        {(loading || rateSheetLoading) && <BaseLoading />}
        {franchise && rateSheet && (
          <IssuerFranchiseSingle
            loading={approvalLoading}
            franchise={franchise}
            rateSheet={rateSheet}
            onApproveFranchise={approveFranchise}
          />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}
