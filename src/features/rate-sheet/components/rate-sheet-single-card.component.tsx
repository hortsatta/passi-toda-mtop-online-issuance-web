import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { convertToCurrency } from '#/core/helpers/core.helper';
import { BaseButtonIcon } from '#/base/components/base-button-icon.component';

import type { ComponentProps, MouseEvent } from 'react';
import type { RateSheet } from '../models/rate-sheet.model';

type Props = ComponentProps<'div'> & {
  rateSheet: RateSheet;
  label?: string;
  showAll?: boolean;
  onUpdate?: (id: number) => void;
};

const MAX_FEES_COUNT = 4;

export const RateSheetSingleCard = memo(function ({
  className,
  rateSheet,
  label,
  showAll,
  onClick,
  onUpdate,
  ...moreProps
}: Props) {
  const [id, rateSheetFees, rateSheetPenaltyFees, totalFees, updatedDate] =
    useMemo(
      () => [
        rateSheet.id,
        (showAll
          ? rateSheet.rateSheetFees.filter((fee) => !fee.isPenalty)
          : rateSheet.rateSheetFees
              .filter((fee) => !fee.isPenalty)
              .slice(0, MAX_FEES_COUNT - 1)
        ).map(({ name, amount }) => ({
          name,
          amount: convertToCurrency(amount),
        })),
        rateSheet.rateSheetFees
          .filter((fee) => fee.isPenalty)
          .map(({ amount, activatePenaltyAfterExpiryDays }) => ({
            name: `Penalty after ${activatePenaltyAfterExpiryDays} days`,
            amount: convertToCurrency(amount),
          })),
        convertToCurrency(
          rateSheet.rateSheetFees.filter((fee) => !fee.isPenalty),
        ),
        `as of ${dayjs(rateSheet.updatedAt).format('YYYY-MM-DD')}`,
      ],
      [rateSheet, showAll],
    );

  const handleUpdate = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onUpdate && onUpdate(id);
    },
    [id, onUpdate],
  );

  return (
    <div
      className={cx(
        'relative flex w-full flex-col gap-2.5 overflow-hidden rounded border border-border bg-backdrop-input p-5 sm:w-[326px]',
        onClick && 'cursor-pointer transition-colors hover:border-primary',
        className,
      )}
      onClick={onClick}
      {...moreProps}
    >
      <div className='flex min-h-12 flex-col items-start gap-1'>
        {label && <h4>{label}</h4>}
        <small className='text-left'>{updatedDate}</small>
        {onUpdate && (
          <div className='absolute right-4 top-3'>
            <BaseButtonIcon
              iconName='arrow-fat-lines-up'
              onClick={handleUpdate}
            />
          </div>
        )}
      </div>
      <div className='flex w-full flex-col gap-2.5 text-base'>
        <div className='flex min-h-[132px] flex-col gap-0.5 border-y border-border py-2.5'>
          {rateSheetFees.map(({ name, amount }, index) => (
            <div
              key={index}
              className='flex w-full items-center justify-between'
            >
              <span>{name}</span>
              <span key={`fee-${index}`} className='text-base'>
                {amount}
              </span>
            </div>
          ))}
          {!showAll && rateSheet.rateSheetFees.length > MAX_FEES_COUNT && (
            <div>......................</div>
          )}
          {showAll && rateSheetPenaltyFees.length && (
            <div className='my-4 flex flex-col gap-2.5 rounded-sm border border-border px-4 py-2.5'>
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
        </div>
        <div className='flex w-full items-center justify-end gap-10 font-bold'>
          <span className='uppercase'>Total</span>
          <span className='text-lg'>{totalFees}</span>
        </div>
      </div>
    </div>
  );
});
