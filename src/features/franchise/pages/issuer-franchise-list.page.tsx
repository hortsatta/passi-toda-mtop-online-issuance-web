import { useLoaderData } from 'react-router-dom';

import { routeConfig } from '#/config/routes.config';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseLoading } from '#/base/components/base-loading.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { BaseSceneListActions } from '#/base/components/base-scene-list-actions.components';
import { IssuerFranchiseList } from '../components/issuer-franchise-list.component';
import { useIssuerFranchiseDigestList } from '../hooks/use-issuer-franchise-digest-list.hook';

export function IssuerFranchiseListPage() {
  const { franchiseDigest, loading, refresh, handleFranchiseDetails } =
    useIssuerFranchiseDigestList();

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene
        pageTitle={routeConfig.franchise.list.pageTitle}
        rightComponent={<BaseSceneListActions onRefreshClick={refresh} />}
      >
        {loading ? (
          <BaseLoading className='h-full' />
        ) : (
          <IssuerFranchiseList
            franchiseDigest={franchiseDigest}
            onFranchiseDetails={handleFranchiseDetails}
          />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}
