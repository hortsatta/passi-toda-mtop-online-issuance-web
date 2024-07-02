import { memo, useMemo } from 'react';
import cx from 'classix';

import { convertToCurrency } from '#/core/helpers/core.helper';

import type { ComponentProps } from 'react';
import type { RateSheet } from '../models/rate-sheet.model';

type Props = ComponentProps<'div'> & {
  rateSheet: RateSheet;
  label?: string;
};

export const RateSheetDetails = memo(function ({
  className,
  rateSheet,
  children,
  ...moreProps
}: Props) {
  const [headerTitle, rateSheetFees, rateSheetPenaltyFees, totalFees] = useMemo(
    () => [
      rateSheet.name,
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
      className={cx('mb-2.5 flex flex-col gap-2.5', className)}
      {...moreProps}
    >
      <h4>{headerTitle}</h4>
      <div className='flex flex-col gap-2.5 rounded border border-border p-4 text-base'>
        {rateSheetFees.map(({ name, amount }, index) => (
          <div key={index} className='flex w-full items-center justify-between'>
            <span>{name}</span>
            <span>{amount}</span>
          </div>
        ))}
        {!!rateSheetPenaltyFees.length && (
          <div className='my-2.5 mb-4 flex flex-col gap-2.5 rounded-sm border border-border px-4 py-2.5'>
            {rateSheetPenaltyFees.map(({ name, amount }, index) => (
              <div
                key={`p-${index}`}
                className='flex w-full items-center justify-between text-sm'
              >
                <span>{name}</span>
                <span key={`p-fee-${index}`} className='text-base'>
                  {amount}
                </span>
              </div>
            ))}
          </div>
        )}
        <div className='w-full border-b border-border' />
        <div className='flex w-full items-center justify-end gap-10 font-bold'>
          <span className='uppercase'>Total</span>
          <span className='text-lg'>{totalFees}</span>
        </div>
      </div>
      {children && <div className='mt-5'>{children}</div>}
    </div>
  );
});
