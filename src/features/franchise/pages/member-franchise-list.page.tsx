import { useLoaderData } from 'react-router-dom';

import { routeConfig } from '#/config/routes.config';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { BaseLoading } from '#/base/components/base-loading.component';
import { BaseSceneListActions } from '#/base/components/base-scene-list-actions.components';
import { useMemberFranchiseList } from '../hooks/use-member-franchise-list.hook';
import { MemberFranchiseList } from '../components/member-franchise-list.component';

export function MemberFranchiseListPage() {
  const {
    franchises,
    loading,
    refresh,
    // handleFranchiseEdit,
    handleFranchiseDetails,
  } = useMemberFranchiseList();

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
          <MemberFranchiseList
            franchises={franchises}
            onFranchiseDetails={handleFranchiseDetails}
          />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}
