import { memo, useMemo } from 'react';
import cx from 'classix';

import { convertToCurrency } from '#/core/helpers/core.helper';
import { BaseFieldText } from '#/base/components/base-field-text.component';
import { BaseIcon } from '#/base/components/base-icon.component';

import type { ComponentProps } from 'react';
import type { RateSheet } from '../models/rate-sheet.model';

type Props = ComponentProps<'div'> & {
  rateSheet: RateSheet;
  paymentORNo?: string;
};

export const RateSheetDetailsPrintView = memo(function ({
  className,
  rateSheet,
  paymentORNo,
  ...moreProps
}: Props) {
  const [headerTitle, rateSheetFees, rateSheetPenaltyFees, totalFees] = useMemo(
    () => [
      `${rateSheet.name} Fees`,
      rateSheet.rateSheetFees
        .filter((fee) => !fee.isPenalty)
        .map(({ name, amount }) => ({
          name,
          amount: convertToCurrency(amount),
        })),
      rateSheet.rateSheetFees
        .filter((fee) => fee.isPenalty && fee.isPenaltyActive)
        .map(({ activatePenaltyAfterExpiryDays, amount }) => ({
          name: `Penalty after ${activatePenaltyAfterExpiryDays} days`,
          amount: convertToCurrency(amount),
        })),
      convertToCurrency(
        rateSheet.rateSheetFees.filter(
          (fee) => !fee.isPenalty || (fee.isPenalty && fee.isPenaltyActive),
        ),
      ),
    ],
    [rateSheet],
  );

  return (
    <div
      className={cx(
        'inline-flex w-fit min-w-[280px] flex-col gap-2.5 self-end',
        className,
      )}
      {...moreProps}
    >
      <h4 className='text-base font-normal uppercase'>{headerTitle}</h4>
      <div className='print-border flex flex-col gap-2.5 rounded-sm border border-border p-4 text-base'>
        {rateSheetFees.map(({ name, amount }, index) => (
          <div key={index} className='flex flex-1 items-center justify-between'>
            <span>{name}</span>
            <span>{amount}</span>
          </div>
        ))}
        {!!rateSheetPenaltyFees.length && (
          <div className='my-2.5 mb-4 flex flex-col rounded-sm border border-border px-4 py-2.5'>
            {rateSheetPenaltyFees.map(({ name, amount }, index) => (
              <div
                key={`p-${index}`}
                className='flex flex-1 items-center justify-between text-sm'
              >
                <span>{name}</span>
                <span key={`p-fee-${index}`} className='text-base'>
                  {amount}
                </span>
              </div>
            ))}
          </div>
        )}
        <div className='print-border flex-1 border-b border-border' />
        <div className='flex flex-1 items-center justify-end gap-5 font-bold'>
          <span className='uppercase'>Total</span>
          <span className='text-lg'>{totalFees}</span>
        </div>
      </div>
      <div className='flex items-center justify-between gap-2.5'>
        {paymentORNo?.length ? (
          <BaseFieldText
            className='max-w-[200px]'
            label='Official Receipt No'
            isPrint
          >
            {paymentORNo}
          </BaseFieldText>
        ) : (
          <div className='max-w-[200px]' />
        )}
        <div className='flex items-center gap-1 text-lg'>
          <BaseIcon
            name={paymentORNo?.length ? 'check-circle' : 'x-circle'}
            size={20}
          />
          <span>Paid</span>
        </div>
      </div>
    </div>
  );
});
