import { memo, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FieldErrors, FormProvider, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import cx from 'classix';

import { baseAdminRoute, routeConfig } from '#/config/routes.config';
import { getErrorMessage } from '#/core/helpers/core.helper';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseButtonIcon } from '#/base/components/base-button-icon.component';
import { BaseButton } from '#/base/components/base-button.component';
import { BaseControlledInputSelect } from '#/base/components/base-input-select.component';
import { FeeType } from '../models/rate-sheet.model';
import {
  franchiseFeeTypeName,
  franchiseFeeTypeSelectOptions,
  createRateSheetFeeDefaultValues,
} from '../helpers/rate-sheet-form.helper';
import { RateSheetFeesFranchiseUpsertForm } from './rate-sheet-fees-franchise-upsert-form.component';

import type { FormProps } from '#/base/models/base.model';
import type { RateSheet } from '../models/rate-sheet.model';
import type {
  RateSheetFeeUpsertFormData,
  RateSheetUpsertFormData,
} from '../models/rate-sheet-form-data.model';

type Props = FormProps<'div', RateSheetUpsertFormData, Promise<RateSheet>>;

const FRANCHISE_RATE_SHEET_LIST_TO = `/${baseAdminRoute}/${routeConfig.franchise.to}/${routeConfig.franchise.rates.to}`;

const rateSheetFeeSchema = z
  .object({
    name: z.string().min(1, 'Invalid fee name').max(225, 'Invalid fee name'),
    amount: z.string({ required_error: 'Provide amount' }),
    isPenalty: z.boolean(),
    activatePenaltyAfterExpiryDays: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isPenalty && data.activatePenaltyAfterExpiryDays == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid days after expiry',
        path: ['activatePenaltyAfterExpiryDays'],
      });
    }
  });

const schema = z.object({
  name: z.string().min(1, 'Invalid rate name').max(225, 'Invalid rate name'),
  feeType: z.nativeEnum(FeeType, {
    required_error: 'Provide the fee type',
  }),
  rateSheetFees: z.array(rateSheetFeeSchema).min(1),
});

const defaultValues: Partial<RateSheetUpsertFormData> = {
  name: '',
  feeType: undefined,
  rateSheetFees: [
    createRateSheetFeeDefaultValues() as RateSheetFeeUpsertFormData,
  ],
};

export const RateSheetFranchiseUpsertForm = memo(function ({
  className,
  formData,
  loading: formLoading,
  isDone,
  onDone,
  onSubmit,
  ...moreProps
}: Props) {
  const navigate = useNavigate();

  const setRateSheetFormData = useBoundStore(
    (state) => state.setRateSheetFormData,
  );

  const methods = useForm<RateSheetUpsertFormData>({
    shouldFocusError: false,
    defaultValues: formData || defaultValues,
    resolver: zodResolver(schema),
  });

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    setValue,
    reset,
  } = methods;

  const feeType = useWatch({ control, name: 'feeType' });

  const loading = useMemo(
    () => formLoading || isSubmitting || isDone,
    [formLoading, isSubmitting, isDone],
  );

  const handleReset = useCallback(() => {
    reset(formData ?? defaultValues);
  }, [formData, reset]);

  const handleSubmitError = useCallback(
    (errors: FieldErrors<RateSheetUpsertFormData>) => {
      const errorMessage = getErrorMessage(errors);
      toast.error(errorMessage || '');
    },
    [],
  );

  const submitForm = useCallback(
    async (data: RateSheetUpsertFormData) => {
      try {
        const rateSheet = await onSubmit(data);
        const successText = `Franchise ${rateSheet.feeType === FeeType.FranchiseRegistration ? 'registration' : 'renewal'} rate updated`;

        toast.success(successText);
        onDone && onDone(true);
        navigate(FRANCHISE_RATE_SHEET_LIST_TO);
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [onSubmit, onDone, navigate],
  );

  useEffect(() => {
    return () => {
      setRateSheetFormData();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!feeType) return;
    setValue('name', franchiseFeeTypeName[feeType]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feeType]);

  return (
    <div
      className={cx(
        'w-full rounded bg-backdrop-surface px-16 py-12',
        className,
      )}
      {...moreProps}
    >
      <FormProvider {...methods}>
        <form
          className='flex flex-col gap-10'
          onSubmit={handleSubmit(submitForm, handleSubmitError)}
        >
          <fieldset className='flex flex-col gap-6' disabled={loading}>
            {!(formData && feeType) && (
              <div className='flex flex-col gap-4'>
                <h4>Fee Type</h4>
                <div className='flex flex-col gap-2.5'>
                  <BaseControlledInputSelect
                    name='feeType'
                    label='Type'
                    items={franchiseFeeTypeSelectOptions}
                    control={control}
                    fullWidth
                    asterisk
                  />
                </div>
              </div>
            )}
            <RateSheetFeesFranchiseUpsertForm />
          </fieldset>
          <div className='w-full border-b border-border' />
          <div className='flex w-full items-center justify-between'>
            <div className='flex items-center gap-4'>
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
              {formData ? 'Update' : 'Add new'}
            </BaseButton>
          </div>
        </form>
      </FormProvider>
    </div>
  );
});
