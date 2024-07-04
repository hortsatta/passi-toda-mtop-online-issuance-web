import { useRef, useCallback } from 'react';
import { useLoaderData } from 'react-router-dom';

import { routeConfig } from '#/config/routes.config';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseLoading } from '#/base/components/base-loading.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { useRateSheetLatestSingle } from '#/rate-sheet/hooks/use-rate-sheet-latest-single.hook';
import { useFranchiseSinglePrint } from '../hooks/use-franchise-single-print.hook';
import { useIssuerFranchiseSingle } from '../hooks/use-issuer-franchise-single.hook';
import { FranchiseSingleActions } from '../components/franchise-single-actions.component';
import { FranchiseSinglePrintView } from '../components/franchise-single-print-view.component';

export function IssuerFranchiseSinglePrintViewPage() {
  const { franchise, loading } = useIssuerFranchiseSingle();

  const { rateSheets, loading: rateSheetLoading } = useRateSheetLatestSingle(
    franchise?.id,
  );

  const data: any = useLoaderData();
  const contentRef = useRef(null);

  const getPrintContent = useCallback(() => contentRef.current, []);

  const { print } = useFranchiseSinglePrint({
    franchise,
    content: getPrintContent,
    documentTitle: 'Franchise Issuance',
    onAfterPrint: window.close,
  });

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene
        pageTitle={routeConfig.franchise.single.print.pageTitle}
        rightComponent={<FranchiseSingleActions onPrint={print} />}
      >
        {(loading || rateSheetLoading) && <BaseLoading />}
        {franchise && rateSheets && (
          <FranchiseSinglePrintView ref={contentRef} franchise={franchise} />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}
