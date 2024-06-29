import { memo, useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
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
  onApproveFranchise?: (
    approvalStatus?: FranchiseApprovalStatus,
  ) => Promise<Franchise>;
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

export const IssuerFranchiseSingle = memo(function ({
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

  const [approvalStatus, expiryDate, isExpired, canRenew] = useMemo(() => {
    const target = franchise.franchiseRenewals.length
      ? franchise.franchiseRenewals[0]
      : franchise;

    return [
      target.approvalStatus,
      target.expiryDate ? dayjs(target.expiryDate).format('YYYY-MM-DD') : null,
      franchise.isExpired,
      franchise.canRenew,
    ];
  }, [franchise]);

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
    if (isExpired) return 'Expired';

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
        return 'Pending Verification';
    }
  }, [approvalStatus, isExpired]);

  const statusLabelClassName = useMemo(() => {
    if (
      isExpired ||
      approvalStatus === FranchiseApprovalStatus.Rejected ||
      approvalStatus === FranchiseApprovalStatus.Canceled
    )
      return 'text-red-600';

    switch (approvalStatus) {
      case FranchiseApprovalStatus.PendingValidation:
      case FranchiseApprovalStatus.Validated:
      case FranchiseApprovalStatus.Paid:
        return 'text-yellow-500';
      case FranchiseApprovalStatus.Approved:
        return 'text-green-600';
      default:
        return null;
    }
  }, [approvalStatus, isExpired]);

  const statusLabelIconName = useMemo(() => {
    if (
      isExpired ||
      approvalStatus === FranchiseApprovalStatus.Rejected ||
      approvalStatus === FranchiseApprovalStatus.Canceled
    ) {
      return 'x-circle';
    } else if (approvalStatus === FranchiseApprovalStatus.Approved) {
      return 'check-circle';
    } else {
      return null;
    }
  }, [approvalStatus, isExpired]);

  const [moreStatusInfoText, moreStatusInfoTextClassName] = useMemo(() => {
    if (approvalStatus !== FranchiseApprovalStatus.Approved) {
      return [null, null];
    }

    if (canRenew) {
      return ['franchise renewal available', 'text-green-600'];
    }

    if (isExpired && !canRenew) {
      return [
        'franchise has fully expired, renewal not possible',
        'text-red-600',
      ];
    }

    return [null, null];
  }, [approvalStatus, isExpired, canRenew]);

  const buttonLabel = useMemo(() => {
    switch (approvalStatus) {
      case FranchiseApprovalStatus.PendingValidation:
        return 'Verify Application';
      case FranchiseApprovalStatus.Paid:
        return 'Approve Franchise';
      default:
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

  const generateApprovalToast = useCallback(
    (status: FranchiseApprovalStatus) => {
      switch (status) {
        case FranchiseApprovalStatus.Validated:
          toast.success(
            'Application verified and awaiting payment from client',
          );
          return;
        case FranchiseApprovalStatus.Approved:
          toast.success('Franchise approved and active');
          return;
        case FranchiseApprovalStatus.Canceled:
          toast.success('Application canceled');
          return;
        default:
          toast.error('Application rejected');
          return;
      }
    },
    [],
  );

  const handleDetailsActionsModalClose = useCallback(() => {
    setOpenActions(false);
    setOpenDetails(false);
  }, []);

  const handleApproveFranchise = useCallback(
    (status?: FranchiseApprovalStatus) => async () => {
      if (!onApproveFranchise) return;

      try {
        const result = await onApproveFranchise(status);
        handleDetailsActionsModalClose();
        generateApprovalToast(result.approvalStatus);
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [onApproveFranchise, generateApprovalToast, handleDetailsActionsModalClose],
  );

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
              <div className='flex flex-col items-end gap-2'>
                <CurrentStatus approvalStatus={approvalStatus} />
                {approvalStatus === FranchiseApprovalStatus.Approved && (
                  <div className='flex items-center gap-2.5'>
                    {moreStatusInfoText && (
                      <>
                        <small
                          className={cx('text-xs', moreStatusInfoTextClassName)}
                        >
                          {moreStatusInfoText}
                        </small>
                        <div className='h-6 border-r border-border' />
                      </>
                    )}
                    <span>valid until {expiryDate}</span>
                  </div>
                )}
              </div>
            )}
        </div>
        {buttonLabel && (
          <>
            <div className='my-2.5 w-full border-b border-border' />
            <div className='flex w-full items-start justify-between gap-2.5'>
              <div className='flex h-full flex-col items-start gap-2.5 transition-opacity'>
                {onApproveFranchise && (
                  <BaseButton
                    className='h-16 min-w-[210px] !text-base'
                    variant={
                      franchise.approvalStatus === FranchiseApprovalStatus.Paid
                        ? 'accept'
                        : 'primary'
                    }
                    loading={loading}
                    disabled={!buttonLabel}
                    onClick={handleActionsOpen(true, true)}
                  >
                    {buttonLabel}
                  </BaseButton>
                )}
                <button
                  className='w-full min-w-[210px] rounded border border-blue-500 py-1.5 text-blue-500 transition-[filter] hover:brightness-150'
                  onClick={handleDetailsOpen(true)}
                >
                  {detailButtonLabel}
                </button>
              </div>
              {onApproveFranchise && (
                <BaseButton
                  variant='warn'
                  loading={loading}
                  disabled={!buttonLabel}
                  onClick={handleActionsOpen(true, false)}
                >
                  Reject Application
                </BaseButton>
              )}
            </div>
          </>
        )}
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
            onApproveFranchise={
              isActionApprove
                ? handleApproveFranchise()
                : handleApproveFranchise(FranchiseApprovalStatus.Rejected)
            }
          />
        )}
      </BaseModal>
    </>
  );
});
