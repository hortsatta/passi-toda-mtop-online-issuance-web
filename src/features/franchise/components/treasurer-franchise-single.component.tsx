import { memo, useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import cx from 'classix';

import { BaseButton } from '#/base/components/base-button.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { FeeType } from '#/rate-sheet/models/rate-sheet.model';
import { RateSheetDetails } from '#/rate-sheet/components/rate-sheet-details.component';
import { FranchiseApprovalStatus } from '../models/franchise.model';
import { FranchiseRecord } from './franchise-record.component';
import { FranchiseOwnerInfo } from './franchise-owner-info.component';
import { FranchiseDocsModal } from './franchise-docs-modal.component';
import { FranchiseApplicationActions } from './franchise-application-actions.component';

import type { ComponentProps } from 'react';
import type { RateSheet } from '#/rate-sheet/models/rate-sheet.model';
import type { Franchise } from '../models/franchise.model';

type Props = ComponentProps<'div'> & {
  franchise: Franchise;
  rateSheets: RateSheet[];
  onApproveFranchise?: () => Promise<Franchise>;
  loading?: boolean;
};

type CurrentStatusProps = {
  approvalStatus: FranchiseApprovalStatus;
};

const CurrentStatus = memo(function ({ approvalStatus }: CurrentStatusProps) {
  return (
    <div className='flex items-center gap-2.5'>
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
    </div>
  );
});

export const TreasurerFranchiseSingle = memo(function ({
  className,
  loading,
  franchise,
  rateSheets,
  onApproveFranchise,
  ...moreProps
}: Props) {
  const [openDetails, setOpenDetails] = useState(false);
  const [openActions, setOpenActions] = useState(false);
  const [isActionApprove, setIsActionApprove] = useState(false);

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
        return 'Paid';
      case FranchiseApprovalStatus.Approved:
        return 'Active';
      case FranchiseApprovalStatus.Rejected:
        return 'Rejected';
      case FranchiseApprovalStatus.Canceled:
        return 'Canceled';
      default:
        return 'Pending Verification';
    }
  }, [approvalStatus]);

  const statusLabelClassName = useMemo(() => {
    switch (approvalStatus) {
      case FranchiseApprovalStatus.Rejected:
      case FranchiseApprovalStatus.Canceled:
        return 'text-red-600';
      case FranchiseApprovalStatus.PendingValidation:
      case FranchiseApprovalStatus.Validated:
        return 'text-yellow-500';
      case FranchiseApprovalStatus.Paid:
      case FranchiseApprovalStatus.Approved:
        return 'text-green-600';
      default:
        return null;
    }
  }, [approvalStatus]);

  const statusLabelIconName = useMemo(() => {
    if (
      approvalStatus === FranchiseApprovalStatus.Rejected ||
      approvalStatus === FranchiseApprovalStatus.Canceled
    ) {
      return 'x-circle';
    } else if (approvalStatus === FranchiseApprovalStatus.Approved) {
      return 'check-circle';
    } else {
      return null;
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

  const handleDetailsActionsModalClose = useCallback(() => {
    setOpenActions(false);
    setOpenDetails(false);
  }, []);

  const handleApproveFranchise = useCallback(async () => {
    if (!onApproveFranchise) return;

    try {
      await onApproveFranchise();
      handleDetailsActionsModalClose();
      toast.success('Application marked as paid and awaiting approval');
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [onApproveFranchise, handleDetailsActionsModalClose]);

  const handleDetailsOpen = useCallback(
    (open: boolean) => () => {
      setOpenDetails(open);
      setOpenActions(false);
    },
    [],
  );

  const handleActionsOpen = useCallback(
    (open: boolean, isApprove: boolean) => () => {
      setIsActionApprove(isApprove);
      setOpenActions(open);
      setOpenDetails(false);
    },
    [],
  );

  const handleDocsModalClose = useCallback(() => {
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
                statusLabelClassName,
              )}
            >
              {statusLabelIconName && (
                <BaseIcon name={statusLabelIconName} size={24} />
              )}
              {statusLabel}
            </span>
            <small
              className={cx(
                'text-xs uppercase',
                (approvalStatus === FranchiseApprovalStatus.Paid ||
                  approvalStatus === FranchiseApprovalStatus.Approved ||
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
        <div className='my-2.5 w-full border-b border-border' />
        <div className='flex w-full items-start justify-between gap-2.5'>
          <div className='flex h-full flex-col items-start gap-2.5 transition-opacity'>
            {approvalStatus === FranchiseApprovalStatus.Validated &&
              onApproveFranchise && (
                <BaseButton
                  className='h-16 min-w-[210px] !text-base'
                  variant='accept'
                  loading={loading}
                  onClick={handleActionsOpen(true, true)}
                >
                  Confirm Payment
                </BaseButton>
              )}
            <button
              className='w-full min-w-[210px] rounded border border-blue-500 py-1.5 text-blue-500 transition-[filter] hover:brightness-150'
              onClick={handleDetailsOpen(true)}
            >
              {detailButtonLabel}
            </button>
          </div>
        </div>
        <div className='my-2.5 w-full border-b border-border' />
        <div className='flex w-full flex-col items-start gap-6'>
          <FranchiseRecord
            franchise={franchise}
            setCurrentImg={setCurrentImg}
          />
          {!franchise.isDriverOwner && (
            <FranchiseOwnerInfo franchise={franchise} />
          )}
        </div>
      </div>
      <FranchiseDocsModal
        src={currentImg.src}
        title={currentImg.title}
        onClose={handleDocsModalClose}
      />
      <BaseModal
        open={openDetails || openActions}
        title={modalTitle}
        onClose={handleDetailsActionsModalClose}
      >
        {openDetails && currentRateSheet && (
          <RateSheetDetails rateSheet={currentRateSheet} />
        )}
        {openActions && currentRateSheet && handleApproveFranchise && (
          <FranchiseApplicationActions
            loading={loading}
            isApprove={isActionApprove}
            franchise={franchise}
            rateSheet={currentRateSheet}
            onApproveFranchise={handleApproveFranchise}
            isTreasurer
          />
        )}
      </BaseModal>
    </>
  );
});
