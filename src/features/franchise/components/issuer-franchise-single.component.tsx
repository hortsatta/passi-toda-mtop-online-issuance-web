import { memo, useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { BaseButton } from '#/base/components/base-button.component';
import { BaseBadge } from '#/base/components/base-badge.component';
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
  if (
    approvalStatus === FranchiseApprovalStatus.Canceled ||
    approvalStatus === FranchiseApprovalStatus.Rejected
  ) {
    return (
      <div className='flex items-end gap-2.5'>
        <small className='flex items-center gap-1 text-base uppercase text-red-500'>
          <BaseIcon name='x-circle' size={16} />
          {approvalStatus === FranchiseApprovalStatus.Canceled
            ? 'canceled'
            : 'rejected'}
        </small>
      </div>
    );
  }

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

  const [
    approvalStatus,
    approvalDate,
    expiryDate,
    isExpired,
    canRenew,
    isRenewal,
  ] = useMemo(() => {
    const target = franchise.franchiseRenewals.length
      ? franchise.franchiseRenewals[0]
      : franchise;

    return [
      target.approvalStatus,
      target.approvalDate,
      target.expiryDate,
      franchise.isExpired,
      franchise.canRenew,
      !!franchise.franchiseRenewals.length,
    ];
  }, [franchise]);

  const currentRateSheet = useMemo(
    () =>
      rateSheets.find((rateSheet) => {
        const feeType = isRenewal
          ? FeeType.FranchiseRenewal
          : FeeType.FranchiseRegistration;
        return rateSheet.feeType === feeType;
      }),
    [rateSheets, isRenewal],
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
    if (approvalStatus === FranchiseApprovalStatus.Approved) {
      if (canRenew) {
        return ['franchise renewal available', 'text-green-600'];
      } else if (isExpired && !canRenew) {
        return [
          'franchise has fully expired, renewal not possible',
          'text-red-600',
        ];
      }

      return [null, null];
    }

    return [isRenewal ? 'renewal' : 'registration', null];
  }, [approvalStatus, isExpired, canRenew, isRenewal]);

  const expiryDateText = useMemo(() => {
    const date = dayjs(expiryDate).format('YYYY-MM-DD');
    return `valid until ${date}`;
  }, [expiryDate]);

  const approvalDateText = useMemo(() => {
    const date = dayjs(approvalDate).format('YYYY-MM-DD');
    return `granted on ${date}`;
  }, [approvalDate]);

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
          <div className='flex flex-col items-end gap-2'>
            <CurrentStatus approvalStatus={approvalStatus} />
            <div className='flex items-center gap-2.5'>
              {moreStatusInfoText && (
                <BaseBadge
                  className={cx('text-xs', moreStatusInfoTextClassName)}
                >
                  {moreStatusInfoText}
                </BaseBadge>
              )}
              {moreStatusInfoText &&
                approvalStatus === FranchiseApprovalStatus.Approved && (
                  <div className='h-6 border-r border-border' />
                )}
              {approvalStatus === FranchiseApprovalStatus.Approved && (
                <div className='flex items-center gap-1.5'>
                  {approvalDateText && (
                    <BaseBadge>{approvalDateText}</BaseBadge>
                  )}
                  {expiryDateText && <BaseBadge>{expiryDateText}</BaseBadge>}
                </div>
              )}
            </div>
          </div>
        </div>
        {(buttonLabel || detailButtonLabel) && (
          <div className='my-2.5 w-full border-b border-border' />
        )}
        <div className='flex w-full items-start justify-between gap-2.5'>
          <div className='flex h-full flex-col items-start gap-2.5 transition-opacity'>
            {onApproveFranchise && buttonLabel && (
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
            {detailButtonLabel && (
              <button
                className='w-full min-w-[210px] rounded border border-blue-500 py-1.5 text-blue-500 transition-[filter] hover:brightness-150'
                onClick={handleDetailsOpen(true)}
              >
                {detailButtonLabel}
              </button>
            )}
          </div>
          {onApproveFranchise && buttonLabel && (
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
