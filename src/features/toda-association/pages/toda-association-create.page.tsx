import { BaseScene } from '#/base/components/base-scene.component';
import { useTodaAssociationCreate } from '../hooks/use-toda-association-create.hook';
import { TodaAssociationUpsertForm } from '../components/toda-association-upsert-form.component';

export function TodaAssociationCreatePage() {
  const { loading, isDone, setIsDone, createTodaAssociation } =
    useTodaAssociationCreate();

  return (
    <BaseScene pageTitle='Add New Toda Association'>
      <TodaAssociationUpsertForm
        loading={loading}
        isDone={isDone}
        onDone={setIsDone}
        onSubmit={createTodaAssociation}
      />
    </BaseScene>
  );
}
