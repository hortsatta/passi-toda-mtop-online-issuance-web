import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseScene } from '#/base/components/base-scene.component';
import { useTodaAssociationList } from '#/toda-association/hooks/use-toda-association-list.hook';
import { useFranchiseCreate } from '../hooks/use-franchise-create.hook';
import { FranchiseUpsertForm } from '../components/franchise-upsert-form.component';

export function FranchiseRegisterPage() {
  const userProfile = useBoundStore((state) => state.user?.userProfile);

  const { loading, isDone, setIsDone, createFranchise } = useFranchiseCreate();

  const { loading: todaAssociationLoading, todaAssociationSelectItems } =
    useTodaAssociationList();

  return (
    <BaseScene pageTitle='Franchise Registration'>
      {userProfile && (
        <FranchiseUpsertForm
          loading={loading}
          isTodaAssociationFetching={todaAssociationLoading}
          isDone={isDone}
          userProfile={userProfile}
          todaAssociationSelectItems={todaAssociationSelectItems}
          onDone={setIsDone}
          onSubmit={createFranchise}
        />
      )}
    </BaseScene>
  );
}
