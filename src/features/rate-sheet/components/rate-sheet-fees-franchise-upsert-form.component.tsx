import { memo, useCallback, useMemo } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import cx from 'classix';

import { convertToCurrency } from '#/core/helpers/core.helper';
import { BaseButtonSimple } from '#/base/components/base-button-simple.component';
import { BaseControlledInput } from '#/base/components/base-input.component';
import { FeeType } from '../models/rate-sheet.model';
import { createRateSheetFeeDefaultValues } from '../helpers/rate-sheet-form.helper';

import type { ComponentProps } from 'react';
import type {
  RateSheetFeeUpsertFormData,
  RateSheetUpsertFormData,
} from '../models/rate-sheet-form-data.model';

export const RateSheetFeesFranchiseUpsertForm = memo(function ({
  className,
  ...moreProps
}: ComponentProps<'div'>) {
  const { control } = useFormContext<RateSheetUpsertFormData>();

  const {
    fields: rateSheetFeeFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'rateSheetFees',
    keyName: 'key',
  });

  const rateSheetFees = useWatch({ control, name: 'rateSheetFees' });
  const feeType = useWatch({ control, name: 'feeType' });

  const totalAmount = useMemo(
    () =>
      convertToCurrency(
        rateSheetFees.filter((fee) => !isNaN(fee.amount) && !fee.isPenalty),
        false,
      ),
    [rateSheetFees],
  );

  const handleAppend = useCallback(
    (isPenalty = false) =>
      () => {
        append(
          createRateSheetFeeDefaultValues(
            isPenalty,
            isPenalty
              ? `penalty-${rateSheetFees.filter((fee) => fee.isPenalty).length + 1}`
              : undefined,
          ) as RateSheetFeeUpsertFormData,
        );
      },
    [rateSheetFees, append],
  );

  const handleRemove = useCallback(
    (index: number, isPenalty = false) =>
      () => {
        if (!isPenalty && rateSheetFeeFields?.length <= 1) {
          toast.error('Must have at least 1 fee');
          return;
        }

        remove(index);
      },
    [rateSheetFeeFields, remove],
  );

  return (
    <div className={cx('flex items-start gap-4', className)} {...moreProps}>
      <div className='flex w-full flex-col gap-5 border-r border-border pr-4'>
        <div className='flex w-full flex-1 flex-col gap-4'>
          <div className='flex w-full items-center justify-between'>
            <h4>Fees</h4>
            <BaseButtonSimple
              className='rounded-sm border-2 border-text/50 px-4 pb-1.5 pt-1 text-base font-medium hover:border-primary'
              iconName='plus'
              onClick={handleAppend()}
            >
              <span>Add Fee</span>
            </BaseButtonSimple>
          </div>
          <div className='flex flex-col gap-2.5'>
            {rateSheetFeeFields.map((field, index) => {
              if (field.isPenalty) return null;

              return (
                <div key={field.key} className='flex items-center gap-2.5'>
                  <BaseButtonSimple
                    iconName='x-square'
                    iconSize={30}
                    onClick={handleRemove(index)}
                  />
                  <BaseControlledInput
                    name={`rateSheetFees.${index}.name`}
                    label='Fee Name'
                    control={control}
                    fullWidth
                    asterisk
                  />
                  <BaseControlledInput
                    type='number'
                    name={`rateSheetFees.${index}.amount`}
                    label='Amount'
                    control={control}
                    fullWidth
                    asterisk
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className='w-full border-b border-border' />
        <div className='flex w-full flex-1 flex-col gap-4'>
          <div className='flex w-full items-center justify-between'>
            <h4>Penalty Fees</h4>
            <BaseButtonSimple
              className='rounded-sm border-2 border-text/50 px-4 pb-1.5 pt-1 text-base font-medium hover:border-primary'
              iconName='plus'
              onClick={handleAppend(true)}
            >
              <span>Add Penalty Fee</span>
            </BaseButtonSimple>
          </div>
          <div className='flex flex-col gap-2.5'>
            {rateSheetFeeFields.map((field, index) => {
              if (!field.isPenalty) return null;

              return (
                <div key={field.key} className='flex items-center gap-2.5'>
                  <BaseButtonSimple
                    iconName='x-square'
                    iconSize={30}
                    onClick={handleRemove(index, true)}
                  />
                  {/* <BaseControlledInput
                    name={`rateSheetFees.${index}.name`}
                    label='Fee Name'
                    control={control}
                    fullWidth
                    asterisk
                  /> */}
                  <BaseControlledInput
                    type='number'
                    name={`rateSheetFees.${index}.activatePenaltyAfterExpiryDays`}
                    label='Days after expiry'
                    control={control}
                    fullWidth
                    asterisk
                  />
                  <BaseControlledInput
                    type='number'
                    name={`rateSheetFees.${index}.amount`}
                    label='Amount'
                    control={control}
                    fullWidth
                    asterisk
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className='flex min-h-[155px] w-full max-w-72 shrink-0 flex-col gap-4 rounded bg-backdrop-input p-4'>
        <div>
          <h4>Total Amount</h4>
          {feeType === FeeType.FranchiseRenewal && (
            <span>without penalties</span>
          )}
        </div>
        <div className='flex flex-1 items-center justify-center overflow-hidden rounded border border-border text-2xl font-bold'>
          <span>{totalAmount}</span>
        </div>
      </div>
    </div>
  );
});
