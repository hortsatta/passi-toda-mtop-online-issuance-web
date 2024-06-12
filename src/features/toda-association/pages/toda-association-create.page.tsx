import { baseAdminRoute, routeConfig } from '#/config/routes.config';
import { BaseScene } from '#/base/components/base-scene.component';
import { useTodaAssociationCreate } from '../hooks/use-toda-association-create.hook';
import { TodaAssociationUpsertForm } from '../components/toda-association-upsert-form.component';

const TODA_ASSOCIATION_LIST_PATH = `/${baseAdminRoute}/${routeConfig.todaAssociation.to}`;

export function TodaAssociationCreatePage() {
  const { loading, isDone, setIsDone, createTodaAssociation } =
    useTodaAssociationCreate();

  return (
    <BaseScene
      pageTitle='Add New Toda Association'
      backTo={TODA_ASSOCIATION_LIST_PATH}
    >
      <TodaAssociationUpsertForm
        loading={loading}
        isDone={isDone}
        onDone={setIsDone}
        onSubmit={createTodaAssociation}
      />
    </BaseScene>
  );
}
