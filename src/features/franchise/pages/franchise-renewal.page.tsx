import { useMemo } from 'react';

import { baseMemberRoute, routeConfig } from '#/config/routes.config';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { useTodaAssociationList } from '#/toda-association/hooks/use-toda-association-list.hook';
import { useDriverProfileList } from '#/user/hooks/use-driver-profile-list.hook';
import { BaseScene } from '#/base/components/base-scene.component';
import { BaseLoading } from '#/base/components/base-loading.component';
import { useFranchiseRenewalCreate } from '../hooks/use-franchise-renewal-create.hook';
import { FranchiseRenewalUpsertForm } from '../components/franchise-renewal-upsert-form.component';

const FRANCHISE_TO = `/${baseMemberRoute}/${routeConfig.franchise.to}`;

export function FranchiseRenewalPage() {
  const user = useBoundStore((state) => state.user);

  const {
    loading,
    franchiseLoading,
    isDone,
    franchise,
    setIsDone,
    createFranchiseRenewal,
  } = useFranchiseRenewalCreate();

  const { loading: todaAssociationLoading, todaAssociationSelectOptions } =
    useTodaAssociationList();

  const { loading: driverProfilesLoading, driverProfiles } =
    useDriverProfileList();

  const backTo = useMemo(
    () => (franchise ? `${FRANCHISE_TO}/${franchise.id}` : FRANCHISE_TO),
    [franchise],
  );

  return (
    <BaseScene
      pageTitle={routeConfig.franchise.renew.pageTitle}
      backTo={backTo}
    >
      {franchiseLoading && <BaseLoading />}
      {user && franchise && (
        <FranchiseRenewalUpsertForm
          loading={loading}
          isFetching={todaAssociationLoading || driverProfilesLoading}
          isDone={isDone}
          user={user}
          franchise={franchise}
          todaAssociationSelectOptions={todaAssociationSelectOptions}
          driverProfiles={driverProfiles}
          onDone={setIsDone}
          onSubmit={createFranchiseRenewal}
        />
      )}
    </BaseScene>
  );
}
