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
  const [headerTitle, fees, totalFees] = useMemo(
    () => [
      rateSheet.name,
      rateSheet.rateSheetFees.map(({ name, amount }) => ({
        name,
        amount: convertToCurrency(amount),
      })),
      convertToCurrency(rateSheet.rateSheetFees),
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
        {fees.map(({ name, amount }, index) => (
          <div key={index} className='flex w-full items-center justify-between'>
            <span>{name}</span>
            <span>{amount}</span>
          </div>
        ))}
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
