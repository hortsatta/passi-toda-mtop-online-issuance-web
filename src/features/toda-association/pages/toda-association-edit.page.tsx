import { useState, useCallback } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { baseAdminRoute, routeConfig } from '#/config/routes.config';
import { BaseScene } from '#/base/components/base-scene.component';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseLoading } from '#/base/components/base-loading.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { BaseButton } from '#/base/components/base-button.component';
import { TodaAssociationUpsertForm } from '../components/toda-association-upsert-form.component';
import { useTodaAssociationEdit } from '../hooks/use-toda-association-edit.hook';

const TODA_ASSOCIATION_LIST_TO = `/${baseAdminRoute}/${routeConfig.todaAssociation.to}`;

export function TodaAssociationEditPage() {
  const { id } = useParams();

  const {
    loading,
    isDone,
    todaAssociationFormData,
    setIsDone,
    editTodaAssociation,
    deleteTodaAssociation,
  } = useTodaAssociationEdit(id ? +id : undefined);

  const data: any = useLoaderData();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const handleSetModal = useCallback(
    (open: boolean) => () => {
      !loading && setOpenModal(open);
    },
    [loading],
  );

  const handleDeleteLesson = useCallback(async () => {
    if (!id || !todaAssociationFormData) {
      return;
    }

    try {
      await deleteTodaAssociation();
      toast.success('TODA Association deleted');
      navigate(TODA_ASSOCIATION_LIST_TO);
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [id, todaAssociationFormData, deleteTodaAssociation, navigate]);

  return (
    <>
      <BaseDataSuspense resolve={data?.main}>
        <BaseScene
          pageTitle={routeConfig.todaAssociation.edit.pageTitle}
          backTo={TODA_ASSOCIATION_LIST_TO}
        >
          {loading && <BaseLoading />}
          {todaAssociationFormData && (
            <TodaAssociationUpsertForm
              loading={loading}
              isDone={isDone}
              formData={todaAssociationFormData}
              onDone={setIsDone}
              onSubmit={editTodaAssociation}
              onDelete={handleSetModal(true)}
            />
          )}
        </BaseScene>
      </BaseDataSuspense>
      <BaseModal
        open={openModal}
        title='Confirm'
        onClose={handleSetModal(false)}
      >
        {todaAssociationFormData && (
          <div className='flex flex-col justify-between gap-10'>
            <p className='text-base'>Delete {todaAssociationFormData.name}?</p>
            <BaseButton
              className='w-full !text-base'
              variant='warn'
              loading={loading}
              onClick={handleDeleteLesson}
            >
              Delete
            </BaseButton>
          </div>
        )}
      </BaseModal>
    </>
  );
}
