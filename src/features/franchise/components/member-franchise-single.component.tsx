import { memo, useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import cx from 'classix';

import { convertToCurrency } from '#/core/helpers/core.helper';
import { BaseButton } from '#/base/components/base-button.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { FeeType } from '#/rate-sheet/models/rate-sheet.model';
import { RateSheetDetails } from '#/rate-sheet/components/rate-sheet-details.component';
import { FranchiseApprovalStatus } from '../models/franchise.model';
import { FranchiseDocsModal } from './franchise-docs-modal.component';
import { FranchiseRecord } from './franchise-record.component';
import { FranchiseApplicationActions } from './franchise-application-actions.component';

import type { ComponentProps } from 'react';
import type { RateSheet } from '#/rate-sheet/models/rate-sheet.model';
import type { Franchise } from '../models/franchise.model';

type Props = ComponentProps<'div'> & {
  franchise: Franchise;
  rateSheets: RateSheet[];
  onCancelApplication: () => Promise<Franchise>;
  loading?: boolean;
};

type CurrentStatusProps = {
  approvalStatus: FranchiseApprovalStatus;
};

const CurrentStatus = memo(function ({ approvalStatus }: CurrentStatusProps) {
  return (
    <div className='flex items-center gap-2.5'>
      {approvalStatus === FranchiseApprovalStatus.PendingValidation && (
        <small className='animate-pulse text-base uppercase text-orange-500'>
          verifying application
        </small>
      )}
      {approvalStatus !== FranchiseApprovalStatus.PendingValidation && (
        <>
          <small
            className={cx(
              'flex items-center gap-1 text-base uppercase',
              approvalStatus === FranchiseApprovalStatus.Validated ||
                approvalStatus === FranchiseApprovalStatus.Paid ||
                approvalStatus === FranchiseApprovalStatus.Approved
                ? 'text-green-500'
                : 'text-text/40',
            )}
          >
            <BaseIcon name='check-circle' size={16} />
            verified
          </small>
          <div className='w-10 border-b border-border' />
          <small
            className={cx(
              'flex items-center gap-1 text-base uppercase',
              approvalStatus === FranchiseApprovalStatus.Paid ||
                approvalStatus === FranchiseApprovalStatus.Approved
                ? 'text-green-500'
                : 'text-text/40',
            )}
          >
            <BaseIcon name='check-circle' size={16} />
            paid
          </small>
          <div className='w-10 border-b border-border' />
          <small
            className={cx(
              'flex items-center gap-1 text-base uppercase',
              approvalStatus === FranchiseApprovalStatus.Approved
                ? 'text-green-500'
                : 'text-text/40',
            )}
          >
            <BaseIcon name='check-circle' size={16} />
            approved
          </small>
        </>
      )}
    </div>
  );
});

export const MemberFranchiseSingle = memo(function ({
  className,
  loading,
  franchise,
  rateSheets,
  onCancelApplication,
  ...moreProps
}: Props) {
  const [openDetails, setOpenDetails] = useState(false);
  const [openActions, setOpenActions] = useState(false);

  const [currentImg, setCurrentImg] = useState<{
    src: string | null;
    title?: string;
  }>({
    src: null,
    title: '',
  });

  const approvalStatus = useMemo(() => franchise.approvalStatus, [franchise]);

  const currentRateSheet = useMemo(
    () =>
      rateSheets.find(
        (rateSheet) =>
          rateSheet.feeType ===
          (approvalStatus === FranchiseApprovalStatus.Approved
            ? FeeType.FranchiseRenewal
            : FeeType.FranchiseRegistration),
      ),
    [rateSheets, approvalStatus],
  );

  const statusLabel = useMemo(() => {
    switch (approvalStatus) {
      case FranchiseApprovalStatus.Validated:
        return 'Pending Payment';
      case FranchiseApprovalStatus.Paid:
        return 'Pending Approval';
      case FranchiseApprovalStatus.Approved:
        return 'Active';
      case FranchiseApprovalStatus.Rejected:
        return 'Rejected';
      case FranchiseApprovalStatus.Canceled:
        return 'Canceled';
      default:
        return 'Pending';
    }
  }, [approvalStatus]);

  const modalTitle = useMemo(() => {
    if (openDetails) {
      return currentRateSheet?.feeType === FeeType.FranchiseRenewal
        ? 'Renewal Details'
        : 'Registration Details';
    } else if (openActions) {
      return 'Confirm';
    }

    return '';
  }, [openDetails, openActions, currentRateSheet]);

  const detailButtonLabel = useMemo(
    () =>
      currentRateSheet?.feeType === FeeType.FranchiseRenewal
        ? 'View Renewal Details'
        : 'View Registration Details',
    [currentRateSheet],
  );

  const totalAmountText = useMemo(
    () => convertToCurrency(currentRateSheet?.rateSheetFees || []),
    [currentRateSheet],
  );

  const handleDetailsActionsModalClose = useCallback(() => {
    setOpenActions(false);
    setOpenDetails(false);
  }, []);

  const handleCancelApplication = useCallback(async () => {
    try {
      await onCancelApplication();
      handleDetailsActionsModalClose();
      toast.error('Application canceled');
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [onCancelApplication, handleDetailsActionsModalClose]);

  const handleDetailsOpen = useCallback(
    (open: boolean) => () => {
      setOpenDetails(open);
      setOpenActions(false);
    },
    [],
  );

  const handleActionsOpen = useCallback(
    (open: boolean) => () => {
      setOpenActions(open);
      setOpenDetails(false);
    },
    [],
  );

  const handleModalClose = useCallback(() => {
    setCurrentImg((prev) => ({ ...prev, src: null }));
  }, []);

  return (
    <>
      <div
        className={cx(
          'flex w-full flex-col gap-5 rounded bg-backdrop-surface px-16 py-12',
          className,
        )}
        {...moreProps}
      >
        <div className='flex w-full items-center justify-between'>
          <div className='flex flex-col'>
            <span
              className={cx(
                'flex items-center gap-1 text-2xl font-bold',
                (approvalStatus === FranchiseApprovalStatus.PendingValidation ||
                  approvalStatus === FranchiseApprovalStatus.Validated ||
                  approvalStatus === FranchiseApprovalStatus.Paid) &&
                  'text-yellow-500',
                approvalStatus === FranchiseApprovalStatus.Approved &&
                  'text-green-600',
                (approvalStatus === FranchiseApprovalStatus.Rejected ||
                  approvalStatus === FranchiseApprovalStatus.Canceled) &&
                  'text-red-600',
              )}
            >
              {approvalStatus === FranchiseApprovalStatus.Approved && (
                <BaseIcon name='check-circle' size={24} />
              )}
              {(approvalStatus === FranchiseApprovalStatus.Rejected ||
                approvalStatus === FranchiseApprovalStatus.Canceled) && (
                <BaseIcon name='x-circle' size={24} />
              )}
              {statusLabel}
            </span>
            <small
              className={cx(
                'text-xs uppercase',
                (approvalStatus === FranchiseApprovalStatus.Approved ||
                  approvalStatus === FranchiseApprovalStatus.Rejected ||
                  approvalStatus === FranchiseApprovalStatus.Canceled) &&
                  'pl-8',
              )}
            >
              status
            </small>
          </div>
          {approvalStatus !== FranchiseApprovalStatus.Rejected &&
            approvalStatus !== FranchiseApprovalStatus.Canceled && (
              <CurrentStatus approvalStatus={approvalStatus} />
            )}
        </div>
        {(approvalStatus === FranchiseApprovalStatus.PendingValidation ||
          approvalStatus === FranchiseApprovalStatus.Validated ||
          approvalStatus === FranchiseApprovalStatus.Paid) && (
          <>
            <div className='my-2.5 w-full border-b border-border' />
            <div className='flex w-full items-start justify-between gap-2.5'>
              <div className='flex h-full flex-col items-start gap-2.5 transition-opacity'>
                {approvalStatus === FranchiseApprovalStatus.Validated && (
                  <>
                    <span className='text-base'>
                      Awaiting{' '}
                      <i className='text-2xl font-bold not-italic underline'>
                        {totalAmountText}
                      </i>{' '}
                      {currentRateSheet?.feeType ===
                      FeeType.FranchiseRegistration
                        ? 'Registration'
                        : 'Renewal'}{' '}
                      Fee Payment
                    </span>
                    <button
                      className='w-full max-w-[210px] rounded border border-blue-500 py-1.5 text-blue-500 transition-[filter] hover:brightness-150'
                      onClick={handleDetailsOpen(true)}
                    >
                      {detailButtonLabel}
                    </button>
                  </>
                )}
              </div>
              <BaseButton
                variant='warn'
                loading={loading}
                onClick={handleActionsOpen(true)}
              >
                Cancel Application
              </BaseButton>
            </div>
          </>
        )}
        <div className='my-2.5 w-full border-b border-border' />
        <div className='flex w-full flex-col'>
          <FranchiseRecord
            franchise={franchise}
            setCurrentImg={setCurrentImg}
          />
        </div>
      </div>
      <FranchiseDocsModal
        src={currentImg.src}
        title={currentImg.title}
        onClose={handleModalClose}
      />
      <BaseModal
        open={openDetails || openActions}
        title={modalTitle}
        onClose={handleDetailsActionsModalClose}
      >
        {openDetails && currentRateSheet && (
          <RateSheetDetails rateSheet={currentRateSheet}>
            Please pay the exact amount at the cashier.
            <br />
            Franchise status will be updated shortly if payment has been made.
          </RateSheetDetails>
        )}
        {openActions && currentRateSheet && (
          <FranchiseApplicationActions
            loading={loading}
            franchise={franchise}
            rateSheet={currentRateSheet}
            onApproveFranchise={handleCancelApplication}
            isUserClient
          />
        )}
      </BaseModal>
    </>
  );
});
