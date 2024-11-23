import { memo, useMemo } from 'react';
import cx from 'classix';

import { convertToCurrency } from '#/core/helpers/core.helper';

import type { ComponentProps } from 'react';
import type { RateSheet } from '../models/rate-sheet.model';

type Props = ComponentProps<'div'> & {
  rateSheet: RateSheet;
  paymentORNo?: string;
  paymentDate?: string;
};

export const RateSheetDetailsPrintView = memo(function ({
  className,
  rateSheet,
  paymentORNo,
  paymentDate,
  ...moreProps
}: Props) {
  const [headerTitle, rateSheetFees, rateSheetPenaltyFees, totalFees] = useMemo(
    () => [
      `Cleared as to Payment of:`,
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
        'inline-flex w-full max-w-[300px] flex-col self-end pr-10',
        className,
      )}
      {...moreProps}
    >
      <div className='flex flex-col gap-1 text-sm'>
        <h4 className='text-sm font-normal leading-none'>{headerTitle}</h4>
        <div className='flex flex-col gap-1'>
          {rateSheetFees.map(({ name }, index) => (
            <div
              key={index}
              className='flex flex-1 items-center justify-between leading-none'
            >
              <span>{name}</span>
            </div>
          ))}
        </div>
        {!!rateSheetPenaltyFees.length && (
          <div className='flex flex-col gap-1'>
            {rateSheetPenaltyFees.map(({ name }, index) => (
              <div
                key={`p-${index}`}
                className='flex flex-1 items-center justify-between leading-none'
              >
                <span>{name}</span>
              </div>
            ))}
          </div>
        )}
        <div className='flex flex-col gap-1'>
          <div className='flex leading-none'>
            <div className='flex flex-1'>
              <span>O.R No.</span>
              <span className='print-border inline-block flex-1 border-b px-1.5'>
                {paymentORNo}
              </span>
            </div>
            <div className='flex flex-1'>
              <span>CTC No.</span>
              <span className='print-border inline-block flex-1 border-b' />
            </div>
          </div>
          <div className='flex leading-none'>
            <div className='flex flex-1'>
              <span>Amount</span>
              <span className='print-border inline-block flex-1 border-b px-1.5'>
                {totalFees}
              </span>
            </div>
            <div className='flex flex-1'>
              <span>Amount</span>
              <span className='print-border inline-block flex-1 border-b' />
            </div>
          </div>
          <div className='flex leading-none'>
            <div className='flex flex-1'>
              <span>Date</span>
              <span className='print-border inline-block flex-1 border-b px-1.5'>
                {paymentDate}
              </span>
            </div>
            <div className='flex flex-1'>
              <span>Date</span>
              <span className='print-border inline-block flex-1 border-b' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
