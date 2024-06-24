import { useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';

import { baseAdminRoute, routeConfig } from '#/config/routes.config';
import { BaseLoading } from '#/base/components/base-loading.component';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { FranchiseListActions } from '#/franchise/components/franchise-list-actions.component';
import { IssuerFranchiseList } from '#/franchise/components/issuer-franchise-list.component';
import { useTodaAssociationSingle } from '../hooks/use-toda-association-single.hook';

const TODA_ASSOCIATION_LIST_TO = `/${baseAdminRoute}/${routeConfig.todaAssociation.to}`;

export function AdminTodaAssociationFranchiseListPage() {
  const { todaAssociation, loading, refresh, handleFranchiseDetails } =
    useTodaAssociationSingle(true);

  const data: any = useLoaderData();

  const pageTitle = useMemo(
    () =>
      `${todaAssociation?.name} Franchises` ||
      routeConfig.todaAssociation.franchise.pageTitle,
    [todaAssociation],
  );

  // TODO FILTERS

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene
        pageTitle={pageTitle}
        backTo={TODA_ASSOCIATION_LIST_TO}
        rightComponent={
          <FranchiseListActions
            // filterOptions={filterOptions}
            // listView={listView}
            // onSearchChange={setKeyword}
            // onFilter={setFilters}
            onRefresh={refresh}
            // onListViewChange={handleListViewChange}
          />
        }
      >
        {todaAssociation == null || loading ? (
          <BaseLoading className='h-full' />
        ) : (
          <IssuerFranchiseList
            franchises={todaAssociation.franchises || []}
            onFranchiseDetails={handleFranchiseDetails}
            isFiltered
            viewOnly
          />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}
