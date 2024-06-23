import { useLoaderData } from 'react-router-dom';

import { routeConfig } from '#/config/routes.config';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { BaseLoading } from '#/base/components/base-loading.component';
import { useMemberFranchiseList } from '../hooks/use-member-franchise-list.hook';
import { issuerAdminFilterOptions } from '../hooks/use-tia-franchise-list.hook';
import { MemberFranchiseList } from '../components/member-franchise-list.component';
import { FranchiseListActions } from '../components/franchise-list-actions.component';

export function MemberFranchiseListPage() {
  const {
    listView,
    franchises,
    loading,
    setKeyword,
    setFilters,
    refresh,
    // handleFranchiseEdit,
    handleFranchiseDetails,
    handleListViewChange,
  } = useMemberFranchiseList();

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene
        pageTitle={routeConfig.franchise.list.pageTitle}
        rightComponent={
          <FranchiseListActions
            filterOptions={issuerAdminFilterOptions}
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
          <MemberFranchiseList
            franchises={franchises}
            listView={listView}
            onFranchiseDetails={handleFranchiseDetails}
          />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}
