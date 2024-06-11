import { useLoaderData } from 'react-router-dom';

import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseLoading } from '#/base/components/base-loading.component';
import { BaseScene } from '#/base/components/base-scene.component';
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
      <BaseScene pageTitle='TODA Associations'>
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
