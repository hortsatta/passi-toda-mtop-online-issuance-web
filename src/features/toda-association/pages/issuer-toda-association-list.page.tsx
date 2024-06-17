import { useLoaderData } from 'react-router-dom';

import { routeConfig } from '#/config/routes.config';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseLoading } from '#/base/components/base-loading.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { useTodaAssociationList } from '../hooks/use-toda-association-list.hook';
import { TodaAssociationList } from '../components/toda-association-list.component';
import { TodaAssociationListActions } from '../components/toda-association-list-actions.component';

export function IssuerTodaAssociationListPage() {
  const {
    todaAssociations,
    loading,
    setKeyword,
    refresh,
    handleTodaAssociationDetails,
  } = useTodaAssociationList();

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene
        pageTitle={routeConfig.todaAssociation.list.pageTitle}
        rightComponent={
          <TodaAssociationListActions
            onSearchChange={setKeyword}
            onRefresh={refresh}
          />
        }
      >
        {loading ? (
          <BaseLoading className='h-full' />
        ) : (
          <TodaAssociationList
            todaAssociations={todaAssociations}
            onTodaAssociationDetails={handleTodaAssociationDetails}
          />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}
