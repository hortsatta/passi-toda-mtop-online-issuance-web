import { baseMemberRoute, routeConfig } from '#/config/routes.config';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseScene } from '#/base/components/base-scene.component';
import { useTodaAssociationList } from '#/toda-association/hooks/use-toda-association-list.hook';
import { useDriverProfileList } from '#/user/hooks/use-driver-profile-list.hook';
import { useFranchiseCreate } from '../hooks/use-franchise-create.hook';
import { FranchiseUpsertForm } from '../components/franchise-upsert-form.component';

const FRANCHISE_LIST_TO = `/${baseMemberRoute}/${routeConfig.franchise.to}`;

export function FranchiseRegisterPage() {
  const user = useBoundStore((state) => state.user);

  const { loading, isDone, setIsDone, createFranchise } = useFranchiseCreate();

  const { loading: todaAssociationLoading, todaAssociationSelectOptions } =
    useTodaAssociationList();

  const { loading: driverProfilesLoading, driverProfiles } =
    useDriverProfileList();

  return (
    <BaseScene
      pageTitle={routeConfig.franchise.create.pageTitle}
      backTo={FRANCHISE_LIST_TO}
    >
      {user && (
        <FranchiseUpsertForm
          loading={loading}
          isFetching={todaAssociationLoading || driverProfilesLoading}
          isDone={isDone}
          user={user}
          todaAssociationSelectOptions={todaAssociationSelectOptions}
          driverProfiles={driverProfiles}
          onDone={setIsDone}
          onSubmit={createFranchise}
        />
      )}
    </BaseScene>
  );
}
