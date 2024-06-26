import { memo, useCallback, useMemo, useState } from 'react';
import cx from 'classix';

import { routeConfig } from '#/config/routes.config';
import { BaseModal } from '#/base/components/base-modal.component';
import { BaseDataEmptyMessage } from '#/base/components/base-data-empty-message.component';
import { RateSheetSingleCard } from './rate-sheet-single-card.component';
import { RateSheetHistoryList } from './rate-sheet-history-list.component';

import type { ComponentProps } from 'react';
import type { FeeType, RateSheet } from '../models/rate-sheet.model';

type Props = ComponentProps<'div'> & {
  registrationRateSheet?: RateSheet;
  renewalRateSheet?: RateSheet;
  selectedHistoryRateSheets?: RateSheet[];
  selectedHistoryRateSheetsloading?: boolean;
  onDetails?: (feeType: FeeType) => void;
  onRateSheetUpdate?: (id: number) => void;
};

export const RateSheetFranchiseList = memo(function ({
  className,
  registrationRateSheet,
  renewalRateSheet,
  selectedHistoryRateSheets,
  selectedHistoryRateSheetsloading,
  onDetails,
  onRateSheetUpdate,
  ...moreProps
}: Props) {
  const [openModal, setOpenModal] = useState(false);

  const isEmpty = useMemo(
    () => !registrationRateSheet && !renewalRateSheet,
    [registrationRateSheet, renewalRateSheet],
  );

  const [currentSelectedRateSheet, previousSelectedRateSheets] = useMemo(() => {
    const currentSelectedRateSheet = selectedHistoryRateSheets?.length
      ? selectedHistoryRateSheets[0]
      : null;

    const previousSelectedRateSheets = selectedHistoryRateSheets?.filter(
      (rateSheet) => rateSheet.id !== currentSelectedRateSheet?.id,
    );

    return [currentSelectedRateSheet, previousSelectedRateSheets];
  }, [selectedHistoryRateSheets]);

  const modalTitle = useMemo(
    () =>
      currentSelectedRateSheet
        ? `${currentSelectedRateSheet.name} Fee Details`
        : undefined,
    [currentSelectedRateSheet],
  );

  const closeModal = useCallback(() => {
    setOpenModal(false);
  }, []);

  const handleDetails = useCallback(
    (feeType: FeeType) => () => {
      onDetails && onDetails(feeType);
      setOpenModal(true);
    },
    [onDetails],
  );

  return (
    <>
      <div
        className={cx(
          'w-full rounded bg-backdrop-surface px-16 py-12',
          className,
        )}
        {...moreProps}
      >
        {isEmpty ? (
          <BaseDataEmptyMessage
            message='No rates to show'
            linkLabel='Add New'
            linkTo={routeConfig.franchise.rates.create.to}
          />
        ) : (
          <div className='flex items-center gap-2.5'>
            {registrationRateSheet && (
              <RateSheetSingleCard
                rateSheet={registrationRateSheet}
                label='Registration Fee'
                onClick={handleDetails(registrationRateSheet.feeType)}
              />
            )}
            {renewalRateSheet && (
              <RateSheetSingleCard
                rateSheet={renewalRateSheet}
                label='Renewal Fee'
                onClick={handleDetails(renewalRateSheet.feeType)}
              />
            )}
          </div>
        )}
      </div>
      <BaseModal open={openModal} title={modalTitle} onClose={closeModal}>
        <RateSheetHistoryList
          currentSelectedRateSheet={currentSelectedRateSheet}
          previousSelectedRateSheets={previousSelectedRateSheets}
          selectedHistoryRateSheetsloading={selectedHistoryRateSheetsloading}
          onUpdate={onRateSheetUpdate}
        />
      </BaseModal>
    </>
  );
});
