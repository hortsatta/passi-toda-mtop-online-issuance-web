import { useLoaderData } from 'react-router-dom';

import { routeConfig } from '#/config/routes.config';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseLoading } from '#/base/components/base-loading.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { useTIAFranchiseList } from '../hooks/use-tia-franchise-list.hook';
import { IssuerFranchiseList } from '../components/issuer-franchise-list.component';
import { FranchiseListActions } from '../components/franchise-list-actions.component';

export function IssuerFranchiseListPage() {
  const {
    loading,
    franchiseDigest,
    franchises,
    isFiltered,
    filterOptions,
    listView,
    setKeyword,
    setFilters,
    refresh,
    handleFranchiseDetails,
    handleListViewChange,
  } = useTIAFranchiseList();

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene
        pageTitle={routeConfig.franchise.list.pageTitle}
        rightComponent={
          <FranchiseListActions
            filterOptions={filterOptions}
            listView={listView}
            onSearchChange={setKeyword}
            onFilter={setFilters}
            onRefresh={refresh}
            onListViewChange={handleListViewChange}
          />
        }
      >
        {loading ? (
          <BaseLoading className='h-full' />
        ) : (
          <IssuerFranchiseList
            franchises={franchises}
            franchiseDigest={franchiseDigest}
            isFiltered={isFiltered}
            listView={listView}
            onFranchiseDetails={handleFranchiseDetails}
          />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}
