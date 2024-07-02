import { memo, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { BaseIcon } from '#/base/components/base-icon.component';
import { FranchiseApprovalStatus } from '../models/franchise.model';

import type { ComponentProps } from 'react';
import type { Franchise } from '../models/franchise.model';
import { BaseBadge } from '#/base/components/base-badge.component';

type Props = ComponentProps<'button'> & {
  franchise: Franchise;
  isDashboard?: boolean;
  onDetails?: () => void;
  // onEdit?: () => void;
};

type CurrentStatusProps = {
  approvalStatus: FranchiseApprovalStatus;
};

const CurrentStatus = memo(function ({ approvalStatus }: CurrentStatusProps) {
  if (approvalStatus === FranchiseApprovalStatus.PendingValidation) {
    return (
      <div className='flex flex-col gap-0.5'>
        <small className='flex items-center gap-1 text-sm uppercase text-orange-500'>
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
      <div className='flex flex-col gap-0.5'>
        <small className='flex items-center gap-1 text-sm uppercase text-red-500'>
          <BaseIcon name='x-circle' size={16} />
          {approvalStatus === FranchiseApprovalStatus.Canceled
            ? 'canceled'
            : 'rejected'}
        </small>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-0.5'>
      {(approvalStatus === FranchiseApprovalStatus.Validated ||
        approvalStatus === FranchiseApprovalStatus.Paid ||
        approvalStatus === FranchiseApprovalStatus.Approved) && (
        <small className='flex items-center gap-1 text-xs uppercase text-green-500'>
          <BaseIcon name='check-circle' size={16} />
          verified
        </small>
      )}
      {(approvalStatus === FranchiseApprovalStatus.Paid ||
        approvalStatus === FranchiseApprovalStatus.Approved) && (
        <small className='flex items-center gap-1 text-xs uppercase text-green-500'>
          <BaseIcon name='check-circle' size={16} />
          paid
        </small>
      )}
      {approvalStatus === FranchiseApprovalStatus.Approved && (
        <small className='flex items-center gap-1 text-xs uppercase text-green-500'>
          <BaseIcon name='check-circle' size={16} />
          approved
        </small>
      )}
    </div>
  );
});

export const MemberFranchiseSingleCard = memo(function ({
  className,
  franchise,
  onDetails,
  ...moreProps
}: Props) {
  const [
    mvFileNo,
    plateNo,
    isExpired,
    canRenew,
    approvalStatus,
    approvalDate,
    expiryDate,
    todaAssociationName,
    isRenewal,
  ] = useMemo(() => {
    const target = franchise.franchiseRenewals.length
      ? franchise.franchiseRenewals[0]
      : franchise;
    return [
      franchise.mvFileNo,
      franchise.plateNo,
      franchise.isExpired,
      franchise.canRenew,
      target.approvalStatus,
      target.approvalDate,
      target.expiryDate,
      target.todaAssociation.name,
      !!franchise.franchiseRenewals.length,
    ];
  }, [franchise]);

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
        return 'Pending';
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
    const registrationRenewalText = isRenewal ? 'renewal' : 'registration';

    if (approvalStatus === FranchiseApprovalStatus.Approved) {
      if (canRenew) {
        return ['select to renew franchise', 'text-green-600'];
      } else if (isExpired && !canRenew) {
        return [
          'franchise has fully expired, renewal not possible',
          'text-red-600',
        ];
      }
    } else if (approvalStatus === FranchiseApprovalStatus.Validated) {
      return [
        `select to view ${registrationRenewalText} payment details`,
        'text-green-600',
      ];
    } else if (
      approvalStatus === FranchiseApprovalStatus.PendingValidation ||
      approvalStatus === FranchiseApprovalStatus.Paid ||
      approvalStatus === FranchiseApprovalStatus.Canceled ||
      approvalStatus === FranchiseApprovalStatus.Rejected
    ) {
      return [registrationRenewalText, null];
    }

    return [null, null];
  }, [approvalStatus, canRenew, isExpired, isRenewal]);

  const expiryDateText = useMemo(() => {
    const date = dayjs(expiryDate).format('YYYY-MM-DD');
    return `valid until ${date}`;
  }, [expiryDate]);

  const approvalDateText = useMemo(() => {
    const date = dayjs(approvalDate).format('YYYY-MM-DD');
    return `granted on ${date}`;
  }, [approvalDate]);

  return (
    <button
      className={cx(
        'relative flex w-[326px] flex-shrink-0 cursor-pointer flex-col justify-between gap-4 rounded border border-border bg-backdrop-input px-5 py-4 text-left transition-colors hover:border-primary',
        className,
      )}
      onClick={onDetails}
      {...moreProps}
    >
      <div className='flex w-full flex-col'>
        <div className='flex items-start justify-between'>
          <div className='flex flex-col gap-5'>
            <div className='flex flex-col'>
              <h4 className='text-2xl font-bold uppercase leading-tight'>
                {plateNo}
              </h4>
              <small className='uppercase leading-tight'>plate no</small>
            </div>
            <div className='flex flex-col'>
              <span className='text-base font-medium'>{mvFileNo}</span>
              <small className='uppercase leading-tight'>mv file no</small>
            </div>
          </div>
          <div className='items-right flex flex-col'>
            <span className='text-right text-base font-medium'>
              {todaAssociationName}
            </span>
            <small className='uppercase leading-tight'>association</small>
          </div>
        </div>
        <div className='mt-5 w-full border-b border-border' />
      </div>
      <div className='flex min-h-[52px] w-full items-end justify-between'>
        <span
          className={cx(
            '-mb-[3px] flex items-center gap-1 text-xl font-bold',
            statusLabelClassName,
          )}
        >
          {statusLabelIconName && (
            <BaseIcon name={statusLabelIconName} size={24} />
          )}
          {statusLabel}
        </span>
        <CurrentStatus approvalStatus={approvalStatus} />
      </div>
      <div className='flex items-center gap-2.5'>
        {moreStatusInfoText && (
          <BaseBadge className={moreStatusInfoTextClassName || ''}>
            {moreStatusInfoText}
          </BaseBadge>
        )}
        {moreStatusInfoText &&
          approvalStatus === FranchiseApprovalStatus.Approved && (
            <div className='h-6 border-r border-border' />
          )}
        {approvalStatus === FranchiseApprovalStatus.Approved && (
          <div className='flex gap-1.5'>
            {approvalDateText && <BaseBadge>{approvalDateText}</BaseBadge>}
            {expiryDateText && <BaseBadge>{expiryDateText}</BaseBadge>}
          </div>
        )}
      </div>
    </button>
  );
});
