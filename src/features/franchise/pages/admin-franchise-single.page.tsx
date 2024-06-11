import { useLoaderData } from 'react-router-dom';

import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseLoading } from '#/base/components/base-loading.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { useRateSheetLatestSingle } from '#/rate-sheet/hooks/use-rate-sheet-latest-single.hook';
import { useIssuerFranchiseSingle } from '../hooks/use-issuer-franchise-single.hook';
import { IssuerFranchiseSingle } from '../components/issuer-franchise-single.component';

export function AdminFranchiseSinglePage() {
  const { franchise, loading } = useIssuerFranchiseSingle();

  const { rateSheet, loading: rateSheetLoading } = useRateSheetLatestSingle(
    franchise?.approvalStatus,
  );

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene pageTitle='Franchise'>
        {(loading || rateSheetLoading) && <BaseLoading />}
        {franchise && rateSheet && (
          <IssuerFranchiseSingle franchise={franchise} rateSheet={rateSheet} />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}
