import { routeConfig } from '#/config/routes.config';
import { BaseScene } from '#/base/components/base-scene.component';
import { useFranchiseChecker } from '../hooks/use-franchise-checker.hook';
import { FranchiseCheckerForm } from '../components/franchise-checker-form.component';
import { FranchiseCheckerInfo } from '../components/franchise-checker-info.component';

export function FranchiseCheckerPage() {
  const { loading, mvPlateNo, franchise } = useFranchiseChecker();

  return (
    <BaseScene
      className='mx-auto w-full max-w-[800px]'
      pageTitle={routeConfig.franchiseChecker.pageTitle}
      backTo='/'
    >
      <div className='flex flex-col gap-10 overflow-hidden rounded bg-backdrop-surface px-16 py-12'>
        <FranchiseCheckerForm loading={loading} />
        <div className='w-full border-b border-border' />
        <FranchiseCheckerInfo
          mvPlateNo={mvPlateNo}
          franchise={franchise}
          loading={loading}
        />
      </div>
    </BaseScene>
  );
}
