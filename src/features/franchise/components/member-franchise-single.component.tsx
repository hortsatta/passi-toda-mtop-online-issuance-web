import { memo, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { baseMemberRoute, routeConfig } from '#/config/routes.config';
import { convertToCurrency } from '#/core/helpers/core.helper';
import { BaseButton } from '#/base/components/base-button.component';
import { BaseBadge } from '#/base/components/base-badge.component';
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
import type { FranchiseStatusRemarkUpsertFormData } from '../models/franchise-status-remark-form-data.model';

type Props = ComponentProps<'div'> & {
  franchise: Franchise;
  rateSheets: RateSheet[];
  onCancelApplication: (
    statusRemarks?: FranchiseStatusRemarkUpsertFormData[],
  ) => Promise<Franchise>;
  loading?: boolean;
};

type CurrentStatusProps = {
  approvalStatus: FranchiseApprovalStatus;
};

const FRANCHISE_BASE_URL = `/${baseMemberRoute}/${routeConfig.franchise.to}`;

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

  if (approvalStatus === FranchiseApprovalStatus.PendingValidation) {
    return (
      <div className='flex items-end gap-2.5'>
        <small className='flex items-center gap-1 text-base uppercase text-orange-500'>
          <BaseIcon name='cube-focus' size={16} />
          verifying application
        </small>
      </div>
    );
  } else if (
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

export const MemberFranchiseSingle = memo(function ({
  className,
  loading,
  franchise,
  rateSheets,
  onCancelApplication,
  ...moreProps
}: Props) {
  const navigate = useNavigate();
  const [openDetails, setOpenDetails] = useState(false);
  const [openExpiryDetails, setOpenExpiryDetails] = useState(false);
  const [openActions, setOpenActions] = useState(false);

  const [currentImg, setCurrentImg] = useState<{
    src: string | null;
    title?: string;
  }>({
    src: null,
    title: '',
  });

  const [
    id,
    isExpired,
    canRenew,
    statusRemarks,
    approvalStatus,
    approvalDate,
    expiryDate,
    isRenewal,
  ] = useMemo(() => {
    const target = franchise.franchiseRenewals.length
      ? franchise.franchiseRenewals[0]
      : franchise;

    return [
      franchise.id,
      franchise.isExpired,
      franchise.canRenew,
      target.franchiseStatusRemarks?.filter(
        (sr) => !sr.fieldName?.length && !!sr.remark.trim().length,
      ) || [],
      target.approvalStatus,
      target.approvalDate,
      target.expiryDate,
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
        return 'Pending';
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

  const modalTitle = useMemo(() => {
    if (openDetails) {
      return currentRateSheet?.feeType === FeeType.FranchiseRenewal
        ? 'Renewal Details'
        : 'Registration Details';
    } else if (openActions) {
      return 'Confirm';
    } else if (openExpiryDetails) {
      return 'Franchise Details';
    }

    return '';
  }, [openDetails, openActions, openExpiryDetails, currentRateSheet]);

  const detailButtonLabel = useMemo(() => {
    if (
      approvalStatus === FranchiseApprovalStatus.Rejected ||
      approvalStatus === FranchiseApprovalStatus.Canceled ||
      approvalStatus === FranchiseApprovalStatus.Revoked ||
      approvalStatus === FranchiseApprovalStatus.PendingValidation
    ) {
      return null;
    }

    return currentRateSheet?.feeType === FeeType.FranchiseRenewal
      ? 'View Renewal Details'
      : 'View Registration Details';
  }, [approvalStatus, currentRateSheet]);

  const totalAmountText = useMemo(
    () => convertToCurrency(currentRateSheet?.rateSheetFees || []),
    [currentRateSheet],
  );

  const handleDetailsActionsModalClose = useCallback(() => {
    setOpenActions(false);
    setOpenDetails(false);
    setOpenExpiryDetails(false);
  }, []);

  const handleCancelApplication = useCallback(
    async (remarks?: string) => {
      const statusRemarks = [{ remark: remarks || '' }];

      try {
        await onCancelApplication(statusRemarks);
        handleDetailsActionsModalClose();
        toast.error('Application canceled');
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [onCancelApplication, handleDetailsActionsModalClose],
  );

  const handleExpiryDetailsOpen = useCallback(
    (open: boolean) => () => {
      setOpenExpiryDetails(open);
      setOpenDetails(false);
      setOpenActions(false);
    },
    [],
  );

  const handleDetailsOpen = useCallback(
    (open: boolean) => () => {
      setOpenDetails(open);
      setOpenExpiryDetails(false);
      setOpenActions(false);
    },
    [],
  );

  const handleActionsOpen = useCallback(
    (open: boolean) => () => {
      setOpenActions(open);
      setOpenExpiryDetails(false);
      setOpenDetails(false);
    },
    [],
  );

  const handleModalClose = useCallback(() => {
    setCurrentImg((prev) => ({ ...prev, src: null }));
  }, []);

  const handleRenew = useCallback(() => {
    const to = `${FRANCHISE_BASE_URL}/${id}/${routeConfig.franchise.renew.to}`;
    navigate(to);
  }, [id, navigate]);

  return (
    <>
      <div
        className={cx(
          'flex w-full flex-col gap-2.5 rounded bg-backdrop-surface px-4 py-5 sm:gap-5 lg:px-16 lg:py-12',
          className,
        )}
        {...moreProps}
      >
        <div className='flex w-full flex-col items-start justify-between gap-2.5 sm:flex-row sm:items-center'>
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
          <div className='flex flex-col items-end gap-2 self-end'>
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
        {(approvalStatus === FranchiseApprovalStatus.PendingValidation ||
          approvalStatus === FranchiseApprovalStatus.Validated ||
          approvalStatus === FranchiseApprovalStatus.Paid ||
          ((approvalStatus === FranchiseApprovalStatus.Approved ||
            approvalStatus === FranchiseApprovalStatus.Canceled ||
            approvalStatus === FranchiseApprovalStatus.Rejected) &&
            (canRenew || isExpired)) ||
          (approvalStatus === FranchiseApprovalStatus.Approved &&
            !isExpired &&
            !canRenew) ||
          !!statusRemarks.length) && (
          <div className='my-2.5 w-full border-b border-border' />
        )}
        {(approvalStatus === FranchiseApprovalStatus.Approved ||
          approvalStatus === FranchiseApprovalStatus.Canceled ||
          approvalStatus === FranchiseApprovalStatus.Rejected) &&
          (canRenew || isExpired) && (
            <div className='flex h-full flex-col items-start gap-2.5 transition-opacity'>
              <BaseButton
                className='h-16 min-w-[210px] !text-base'
                variant='accept'
                loading={loading}
                disabled={!canRenew}
                onClick={handleRenew}
              >
                Renew Franchise
              </BaseButton>
              {!canRenew && (
                <button
                  className='w-full max-w-[210px] rounded border border-blue-500 py-1.5 text-blue-500 transition-[filter] hover:brightness-150'
                  onClick={handleExpiryDetailsOpen(true)}
                >
                  View Franchise Status
                </button>
              )}
            </div>
          )}
        {(approvalStatus === FranchiseApprovalStatus.PendingValidation ||
          approvalStatus === FranchiseApprovalStatus.Validated ||
          approvalStatus === FranchiseApprovalStatus.Paid ||
          (approvalStatus === FranchiseApprovalStatus.Approved &&
            !canRenew &&
            !isExpired)) && (
          <div className='flex w-full flex-col items-start justify-normal gap-5 sm:flex-row sm:justify-between sm:gap-2.5'>
            <div className='flex h-full w-full flex-col items-start gap-2.5 transition-opacity sm:w-auto'>
              {approvalStatus === FranchiseApprovalStatus.Validated && (
                <span className='text-base'>
                  Awaiting{' '}
                  <i className='text-2xl font-bold not-italic underline'>
                    {totalAmountText}
                  </i>{' '}
                  {currentRateSheet?.feeType === FeeType.FranchiseRegistration
                    ? 'Registration'
                    : 'Renewal'}{' '}
                  Fee Payment
                </span>
              )}
              {detailButtonLabel && (
                <button
                  className='w-full max-w-none rounded border border-blue-500 px-2.5 py-1.5 text-blue-500 transition-[filter] hover:brightness-150 sm:max-w-[210px]'
                  onClick={handleDetailsOpen(true)}
                >
                  {detailButtonLabel}
                </button>
              )}
            </div>
            {approvalStatus !== FranchiseApprovalStatus.Approved && (
              <BaseButton
                className='w-full sm:w-auto'
                variant='warn'
                loading={loading}
                onClick={handleActionsOpen(true)}
              >
                Cancel Application
              </BaseButton>
            )}
          </div>
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
        open={openDetails || openExpiryDetails || openActions}
        title={modalTitle}
        onClose={handleDetailsActionsModalClose}
      >
        {openDetails && currentRateSheet && (
          <RateSheetDetails
            rateSheet={currentRateSheet}
            paymentORNo={paymentORNo}
          >
            {approvalStatus === FranchiseApprovalStatus.Validated && (
              <>
                Please pay the exact amount at the cashier.
                <br />
                Franchise status will be updated shortly if payment has been
                made.
              </>
            )}
          </RateSheetDetails>
        )}
        {openExpiryDetails && (
          <div className='pb-5 text-base'>
            Cannot renew a franchise that has been expired for more than a year.
            Please reregister vehicle.
          </div>
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
