import { useLoaderData } from 'react-router-dom';

import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { BaseLoading } from '#/base/components/base-loading.component';
import { useMemberFranchiseSingle } from '../hooks/use-member-franchise-single.hook';
import { MemberFranchiseSingle } from '../components/member-franchise-single.component';

export function MemberFranchiseSinglePage() {
  const { franchise, loading, approvalLoading, cancelApplication } =
    useMemberFranchiseSingle();

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene pageTitle='Franchise'>
        {loading && <BaseLoading />}
        {franchise && (
          <MemberFranchiseSingle
            franchise={franchise}
            loading={approvalLoading}
            onCancelApplication={cancelApplication}
          />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}
