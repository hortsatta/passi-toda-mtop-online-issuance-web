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
import type { ButtonVariant } from '#/base/models/base.model';
import type { RateSheet } from '#/rate-sheet/models/rate-sheet.model';
import type { Franchise } from '../models/franchise.model';
import type { FranchiseStatusFieldError } from '../models/franchise-status-remark.model';
import type { FranchiseStatusRemarkUpsertFormData } from '../models/franchise-status-remark-form-data.model';

type Props = ComponentProps<'div'> & {
  franchise: Franchise;
  rateSheets: RateSheet[];
  onApproveFranchise?: (data?: {
    approvalStatus?: FranchiseApprovalStatus;
    statusRemarks?: FranchiseStatusRemarkUpsertFormData[];
  }) => Promise<Franchise>;
  loading?: boolean;
};

type CurrentStatusProps = {
  approvalStatus: FranchiseApprovalStatus;
};

const CurrentStatus = memo(function ({ approvalStatus }: CurrentStatusProps) {
  const statusLabel = useMemo(() => {
    switch (approvalStatus) {
      case FranchiseApprovalStatus.Canceled:
        return 'canceled';
      case FranchiseApprovalStatus.Rejected:
        return 'rejected';
      case FranchiseApprovalStatus.Revoked:
        return 'revoked';
    }
  }, [approvalStatus]);

  if (
    approvalStatus === FranchiseApprovalStatus.Canceled ||
    approvalStatus === FranchiseApprovalStatus.Rejected
  ) {
    return (
      <div className='flex items-end gap-2.5'>
        <small className='flex items-center gap-1 text-base uppercase text-red-500'>
          <BaseIcon name='x-circle' size={16} />
          {statusLabel}
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
  const [fieldErrors, setFieldErrors] = useState<FranchiseStatusFieldError[]>(
    [],
  );

  const [currentImg, setCurrentImg] = useState<{
    src: string | null;
    title?: string;
  }>({
    src: null,
    title: '',
  });

  const [
    statusRemarks,
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
      target.franchiseStatusRemarks?.filter(
        (sr) => !sr.fieldName?.length && !!sr.remark.trim().length,
      ) || [],
      target.approvalStatus,
      target.approvalDate,
      target.expiryDate,
      franchise.isExpired,
      franchise.canRenew,
      !!franchise.franchiseRenewals.length,
    ];
  }, [franchise]);

  const paymentORNo = useMemo(() => {
    if (
      approvalStatus === FranchiseApprovalStatus.Canceled ||
      approvalStatus === FranchiseApprovalStatus.Rejected ||
      approvalStatus === FranchiseApprovalStatus.PendingValidation ||
      approvalStatus === FranchiseApprovalStatus.Validated
    )
      return undefined;

    return franchise.paymentORNo;
  }, [approvalStatus, franchise]);

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
      case FranchiseApprovalStatus.Revoked:
        return 'Revoked';
      default:
        return 'Pending Verification';
    }
  }, [approvalStatus, isExpired]);

  const statusLabelClassName = useMemo(() => {
    if (
      isExpired ||
      approvalStatus === FranchiseApprovalStatus.Rejected ||
      approvalStatus === FranchiseApprovalStatus.Canceled ||
      approvalStatus === FranchiseApprovalStatus.Revoked
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
      approvalStatus === FranchiseApprovalStatus.Canceled ||
      approvalStatus === FranchiseApprovalStatus.Revoked
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

  const [buttonLabel, buttonLabelVariant] = useMemo(() => {
    switch (approvalStatus) {
      case FranchiseApprovalStatus.PendingValidation:
        return ['Verify Application', 'primary'];
      case FranchiseApprovalStatus.Paid:
        return ['Approve Application', 'accept'];
      case FranchiseApprovalStatus.Approved:
        return isExpired ? [null, 'primary'] : ['Revoke Franchise', 'warn'];
      default:
        return [null, 'primary'];
    }
  }, [approvalStatus, isExpired]);

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

  const detailButtonLabel = useMemo(() => {
    if (
      approvalStatus === FranchiseApprovalStatus.Rejected ||
      approvalStatus === FranchiseApprovalStatus.Canceled ||
      approvalStatus === FranchiseApprovalStatus.Revoked
    ) {
      return null;
    }

    return currentRateSheet?.feeType === FeeType.FranchiseRenewal
      ? 'View Renewal Details'
      : 'View Registration Details';
  }, [approvalStatus, currentRateSheet]);

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
          toast.error('Application canceled');
          return;
        case FranchiseApprovalStatus.Revoked:
          toast.error('Franchise revoked');
          return;
        case FranchiseApprovalStatus.Rejected:
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
    (approvalStatus?: FranchiseApprovalStatus) => async (remarks?: string) => {
      if (!onApproveFranchise) return;

      try {
        let statusRemarks = undefined;

        if (!isActionApprove) {
          const fieldRemarks = fieldErrors.map((fe) => ({
            remark: '',
            fieldName: fe.name,
          }));
          statusRemarks = [{ remark: remarks || '' }, ...fieldRemarks];
        }

        const result = await onApproveFranchise({
          approvalStatus,
          statusRemarks,
        });

        handleDetailsActionsModalClose();
        generateApprovalToast(result.approvalStatus);
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [
      isActionApprove,
      fieldErrors,
      onApproveFranchise,
      generateApprovalToast,
      handleDetailsActionsModalClose,
    ],
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
                  approvalStatus === FranchiseApprovalStatus.Canceled ||
                  approvalStatus === FranchiseApprovalStatus.Revoked) &&
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
                (approvalStatus === FranchiseApprovalStatus.Approved ||
                  approvalStatus === FranchiseApprovalStatus.Revoked) && (
                  <div className='h-6 border-r border-border' />
                )}
              {(approvalStatus === FranchiseApprovalStatus.Approved ||
                approvalStatus === FranchiseApprovalStatus.Revoked) && (
                <div className='flex items-center gap-1.5'>
                  {approvalDateText && (
                    <BaseBadge>{approvalDateText}</BaseBadge>
                  )}
                  {expiryDateText &&
                    approvalStatus === FranchiseApprovalStatus.Approved && (
                      <BaseBadge>{expiryDateText}</BaseBadge>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
        {(buttonLabel || detailButtonLabel || !!statusRemarks.length) && (
          <div className='my-2.5 w-full border-b border-border' />
        )}
        <div className='flex w-full items-start justify-between gap-2.5'>
          <div className='flex h-full flex-col items-start gap-2.5 transition-opacity'>
            {onApproveFranchise && buttonLabel && (
              <BaseButton
                className='h-16 min-w-[210px] !text-base'
                variant={buttonLabelVariant as ButtonVariant}
                loading={loading}
                disabled={!buttonLabel}
                onClick={
                  approvalStatus === FranchiseApprovalStatus.Approved
                    ? handleActionsOpen(true, false)
                    : handleActionsOpen(true, true)
                }
              >
                {buttonLabel}
              </BaseButton>
            )}
            {detailButtonLabel && (
              <button
                className='w-full min-w-[210px] rounded border border-blue-500 px-2.5 py-1.5 text-blue-500 transition-[filter] hover:brightness-150'
                onClick={handleDetailsOpen(true)}
              >
                {detailButtonLabel}
              </button>
            )}
            {!!statusRemarks.length && (
              <div className='flex flex-col gap-2.5'>
                <h4>Remarks</h4>
                <ul className='flex list-inside list-disc flex-col gap-2.5 text-base'>
                  {statusRemarks.map((sr) => (
                    <li key={sr.id}>{sr.remark}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {onApproveFranchise &&
            buttonLabel &&
            approvalStatus === FranchiseApprovalStatus.PendingValidation && (
              <div className='flex flex-col items-end gap-2.5'>
                <BaseButton
                  className='w-fit'
                  variant='warn'
                  loading={loading}
                  disabled={!buttonLabel}
                  onClick={handleActionsOpen(true, false)}
                >
                  Reject Application
                </BaseButton>
                <span className='max-w-60 text-right text-xs leading-relaxed'>
                  Make sure to highlight fields with issues (if any) before
                  rejecting application
                </span>
              </div>
            )}
        </div>
        <div className='my-2.5 w-full border-b border-border' />
        <div className='flex w-full flex-col items-start gap-6'>
          <FranchiseRecord
            franchise={franchise}
            fieldErrors={fieldErrors}
            canHighlight={
              approvalStatus === FranchiseApprovalStatus.PendingValidation
            }
            setCurrentImg={setCurrentImg}
            setFieldErrors={setFieldErrors}
          />
          {!franchise.isDriverOwner && (
            <FranchiseOwnerInfo
              franchise={franchise}
              fieldErrors={fieldErrors}
              canHighlight={
                approvalStatus === FranchiseApprovalStatus.PendingValidation
              }
              setFieldErrors={setFieldErrors}
            />
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
          <RateSheetDetails
            rateSheet={currentRateSheet}
            paymentORNo={paymentORNo}
          />
        )}
        {openActions && currentRateSheet && handleApproveFranchise && (
          <FranchiseApplicationActions
            loading={loading}
            isApprove={isActionApprove}
            franchise={franchise}
            rateSheet={currentRateSheet}
            fieldErrors={fieldErrors}
            onApproveFranchise={
              isActionApprove
                ? handleApproveFranchise()
                : handleApproveFranchise(
                    approvalStatus === FranchiseApprovalStatus.Approved
                      ? FranchiseApprovalStatus.Revoked
                      : FranchiseApprovalStatus.Rejected,
                  )
            }
          />
        )}
      </BaseModal>
    </>
  );
});
