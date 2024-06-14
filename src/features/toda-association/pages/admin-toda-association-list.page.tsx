import { useLoaderData } from 'react-router-dom';

import { routeConfig } from '#/config/routes.config';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseLoading } from '#/base/components/base-loading.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { BaseSceneListActions } from '#/base/components/base-scene-list-actions.components';
import { useTodaAssociationList } from '../hooks/use-toda-association-list.hook';
import { TodaAssociationList } from '../components/toda-association-list.component';

export function AdminTodaAssociationListPage() {
  const {
    todaAssociations,
    loading,
    refresh,
    handleTodaAssociationDetails,
    handleTodaAssociationEdit,
  } = useTodaAssociationList();

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene
        pageTitle={routeConfig.todaAssociation.list.pageTitle}
        rightComponent={<BaseSceneListActions onRefreshClick={refresh} />}
      >
        {loading ? (
          <BaseLoading className='h-full' />
        ) : (
          <TodaAssociationList
            todaAssociations={todaAssociations}
            onTodaAssociationDetails={handleTodaAssociationDetails}
            onTodaAssociationEdit={handleTodaAssociationEdit}
          />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}
