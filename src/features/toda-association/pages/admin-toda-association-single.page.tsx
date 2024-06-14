import { useLoaderData } from 'react-router-dom';

import { baseAdminRoute, routeConfig } from '#/config/routes.config';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseLoading } from '#/base/components/base-loading.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { useTodaAssociationSingle } from '../hooks/use-toda-association-single.hook';
import { TodaAssociationSingle } from '../components/toda-association-single.component';

const TODA_ASSOCIATION_LIST_TO = `/${baseAdminRoute}/${routeConfig.todaAssociation.to}`;

export function AdminTodaAssociationSinglePage() {
  const { todaAssociation, loading } = useTodaAssociationSingle();
  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene
        pageTitle={routeConfig.todaAssociation.single.pageTitle}
        backTo={TODA_ASSOCIATION_LIST_TO}
      >
        {loading && <BaseLoading />}
        {todaAssociation && (
          <TodaAssociationSingle todaAssociation={todaAssociation} />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}
