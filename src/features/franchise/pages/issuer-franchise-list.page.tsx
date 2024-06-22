import { useLoaderData } from 'react-router-dom';

import { routeConfig } from '#/config/routes.config';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseLoading } from '#/base/components/base-loading.component';
import { BaseScene } from '#/base/components/base-scene.component';
import {
  filterOptions,
  useIssuerAdminFranchiseList,
} from '../hooks/use-issuer-admin-franchise-list.hook';
import { IssuerFranchiseList } from '../components/issuer-franchise-list.component';
import { FranchiseListActions } from '../components/franchise-list-actions.component';

export function IssuerFranchiseListPage() {
  const {
    loading,
    franchiseDigest,
    franchises,
    isFiltered,
    setKeyword,
    setFilters,
    refresh,
    handleFranchiseDetails,
  } = useIssuerAdminFranchiseList();

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene
        pageTitle={routeConfig.franchise.list.pageTitle}
        rightComponent={
          <FranchiseListActions
            filterOptions={filterOptions}
            onSearchChange={setKeyword}
            onFilter={setFilters}
            onRefresh={refresh}
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
            onFranchiseDetails={handleFranchiseDetails}
          />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}
