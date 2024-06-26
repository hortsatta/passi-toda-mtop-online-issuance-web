import { memo } from 'react';

import dayjs from '#/config/dayjs.config';
import { convertToCurrency } from '#/core/helpers/core.helper';
import { BaseLoading } from '#/base/components/base-loading.component';
import { RateSheetSingleCard } from './rate-sheet-single-card.component';

import type { ComponentProps } from 'react';
import type { RateSheet } from '../models/rate-sheet.model';

type Props = ComponentProps<'div'> & {
  currentSelectedRateSheet: RateSheet | null;
  previousSelectedRateSheets?: RateSheet[];
  selectedHistoryRateSheetsloading?: boolean;
  onUpdate?: (id: number) => void;
};

export const RateSheetHistoryList = memo(function ({
  selectedHistoryRateSheetsloading,
  currentSelectedRateSheet,
  previousSelectedRateSheets,
  onUpdate,
  ...moreProps
}: Props) {
  return (
    <div {...moreProps}>
      {selectedHistoryRateSheetsloading ? (
        <div className='flex w-full items-center justify-center'>
          <BaseLoading compact />
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          {currentSelectedRateSheet && (
            <RateSheetSingleCard
              className='!w-full'
              rateSheet={currentSelectedRateSheet}
              onUpdate={onUpdate}
              showAll
            />
          )}
          <div className='flex flex-col gap-2.5'>
            <span className='text-base'>History</span>
            <div className='border-b border-border' />
            {previousSelectedRateSheets?.length ? (
              previousSelectedRateSheets.map((rateSheet) => (
                <div
                  key={rateSheet.id}
                  className='flex w-full flex-col gap-2.5 overflow-hidden rounded border border-border bg-backdrop-input p-5'
                >
                  <small className='text-left'>
                    {dayjs(rateSheet.updatedAt).format('YYYY-MM-DD')}
                  </small>
                  <div className='flex w-full items-center justify-end gap-10 font-bold'>
                    <span className='uppercase'>Total</span>
                    <span className='text-lg'>
                      {convertToCurrency(rateSheet.rateSheetFees)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <span className='w-full text-center opacity-50'>
                Nothing to show
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
});
