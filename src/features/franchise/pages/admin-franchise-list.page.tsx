import { useLoaderData } from 'react-router-dom';

import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseLoading } from '#/base/components/base-loading.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { useAdminFranchiseDigestList } from '../hooks/user-admin-franchise-digest-list.hook';
import { IssuerFranchiseList } from '../components/issuer-franchise-list.component';

export function AdminFranchiseListPage() {
  const { franchiseDigest, loading, refresh, handleFranchiseDetails } =
    useAdminFranchiseDigestList();

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene pageTitle='Franchises'>
        {loading ? (
          <BaseLoading className='h-full' />
        ) : (
          <IssuerFranchiseList
            franchiseDigest={franchiseDigest}
            onFranchiseDetails={handleFranchiseDetails}
            viewOnly
          />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}
