import { useLoaderData } from 'react-router-dom';

import { baseAdminRoute, routeConfig } from '#/config/routes.config';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseLoading } from '#/base/components/base-loading.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { useRateSheetLatestSingle } from '#/rate-sheet/hooks/use-rate-sheet-latest-single.hook';
import { useIssuerFranchiseSingle } from '../hooks/use-issuer-franchise-single.hook';
import { IssuerFranchiseSingle } from '../components/issuer-franchise-single.component';

const FRANCHISE_LIST_TO = `/${baseAdminRoute}/${routeConfig.franchise.to}`;

export function AdminFranchiseSinglePage() {
  const { franchise, loading } = useIssuerFranchiseSingle();

  const { rateSheets, loading: rateSheetLoading } = useRateSheetLatestSingle(
    franchise?.id,
  );

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene
        pageTitle={routeConfig.franchise.single.pageTitle}
        backTo={FRANCHISE_LIST_TO}
      >
        {(loading || rateSheetLoading) && <BaseLoading />}
        {franchise && rateSheets?.length && (
          <IssuerFranchiseSingle
            franchise={franchise}
            rateSheets={rateSheets}
          />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}
