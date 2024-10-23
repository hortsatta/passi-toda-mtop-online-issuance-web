import { memo, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FieldErrors, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import cx from 'classix';

import { baseAdminRoute, routeConfig } from '#/config/routes.config';
import { getErrorMessage } from '#/core/helpers/core.helper';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseButton } from '#/base/components/base-button.component';
import { BaseButtonIcon } from '#/base/components/base-button-icon.component';
import { BaseControlledInput } from '#/base/components/base-input.component';

import type { FormProps } from '#/base/models/base.model';
import type { TodaAssociation } from '../models/toda-association.model';
import type { TodaAssociationUpsertFormData } from '../models/toda-association-form-data.model';

type Props = FormProps<
  'div',
  TodaAssociationUpsertFormData,
  Promise<TodaAssociation>
>;

const TODA_ASSOCIATION_LIST_TO = `/${baseAdminRoute}/${routeConfig.todaAssociation.to}`;

const schema = z.object({
  name: z.string().max(225, 'Invalid association name'),
  authorizedRoute: z.string(),
  presidentFirstName: z
    .string()
    .min(2, 'Name is too short')
    .max(50, 'Name is too long'),
  presidentLastName: z
    .string()
    .min(2, 'Name is too short')
    .max(50, 'Name is too long'),
  presidentMiddleName: z.string().max(50, 'Name is too long').optional(),
});

const defaultValues: Partial<TodaAssociationUpsertFormData> = {
  name: '',
  authorizedRoute: '',
  presidentFirstName: '',
  presidentLastName: '',
  presidentMiddleName: '',
};

export const TodaAssociationUpsertForm = memo(function ({
  className,
  formData,
  loading: formLoading,
  isDone,
  onDone,
  onSubmit,
  onDelete,
  ...moreProps
}: Props) {
  const navigate = useNavigate();

  const setTodaAssociationFormData = useBoundStore(
    (state) => state.setTodaAssociationFormData,
  );

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = useForm<TodaAssociationUpsertFormData>({
    shouldFocusError: false,
    defaultValues: formData || defaultValues,
    resolver: zodResolver(schema),
  });

  const loading = useMemo(
    () => formLoading || isSubmitting || isDone,
    [formLoading, isSubmitting, isDone],
  );

  const handleReset = useCallback(() => {
    reset(formData ?? defaultValues);
  }, [formData, reset]);

  const handleSubmitError = useCallback(
    (errors: FieldErrors<TodaAssociationUpsertFormData>) => {
      const errorMessage = getErrorMessage(errors);
      toast.error(errorMessage || '');
    },
    [],
  );

  const submitForm = useCallback(
    async (data: TodaAssociationUpsertFormData) => {
      try {
        await onSubmit(data);
        const successText = `Toda association ${formData ? 'updated' : 'added'}`;

        toast.success(successText);
        onDone && onDone(true);
        navigate(TODA_ASSOCIATION_LIST_TO);
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [formData, onSubmit, onDone, navigate],
  );

  useEffect(() => {
    return () => {
      setTodaAssociationFormData();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={cx(
        'w-full rounded bg-backdrop-surface px-4 py-5 lg:px-16 lg:py-12',
        className,
      )}
      {...moreProps}
    >
      <form
        className='flex flex-col gap-5 lg:gap-10'
        onSubmit={handleSubmit(submitForm, handleSubmitError)}
      >
        <fieldset className='flex flex-col gap-6' disabled={loading}>
          <div className='flex flex-col gap-4'>
            <h4>Association Info</h4>
            <div className='flex flex-col gap-2.5'>
              <BaseControlledInput
                name='name'
                label='Association Name'
                control={control}
                fullWidth
                asterisk
              />
              <BaseControlledInput
                name='authorizedRoute'
                label='Authorized Route'
                control={control}
                fullWidth
                asterisk
              />
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            <h4>More Info</h4>
            <div className='flex flex-col gap-2.5 sm:flex-row'>
              <BaseControlledInput
                name='presidentFirstName'
                label='President First Name'
                control={control}
                fullWidth
                asterisk
              />
              <BaseControlledInput
                name='presidentLastName'
                label='President Last Name'
                control={control}
                fullWidth
                asterisk
              />
              <BaseControlledInput
                name='presidentMiddleName'
                label='President Middle Name'
                control={control}
                fullWidth
              />
            </div>
          </div>
        </fieldset>
        <div className='w-full border-b border-border' />
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-4'>
            {onDelete && (
              <BaseButtonIcon
                iconName='trash'
                variant='warn'
                loading={loading}
                disabled={isDone}
                onClick={onDelete}
              />
            )}
            <BaseButtonIcon
              iconName='arrow-counter-clockwise'
              loading={loading}
              disabled={isDone}
              onClick={handleReset}
            />
          </div>
          <BaseButton
            className='min-w-[200px] px-10 !text-base'
            type='submit'
            loading={loading}
            disabled={isDone}
          >
            {formData ? 'Save Changes' : 'Add new'}
          </BaseButton>
        </div>
      </form>
    </div>
  );
});
