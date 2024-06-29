import { memo, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { BaseIcon } from '#/base/components/base-icon.component';
import { FranchiseApprovalStatus } from '../models/franchise.model';

import type { ComponentProps } from 'react';
import type { Franchise } from '../models/franchise.model';

type Props = ComponentProps<'button'> & {
  franchise: Franchise;
  isDashboard?: boolean;
  viewOnly?: boolean;
  onDetails?: () => void;
};

type CurrentStatusProps = {
  approvalStatus: FranchiseApprovalStatus;
};

const CurrentStatus = memo(function ({ approvalStatus }: CurrentStatusProps) {
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

export const IssuerFranchiseSingleCard = memo(function ({
  className,
  franchise,
  viewOnly,
  onDetails,
  ...moreProps
}: Props) {
  const [
    mvFileNo,
    plateNo,
    isExpired,
    reverseFullName,
    approvalStatus,
    expiryDate,
    todaAssociationName,
  ] = useMemo(() => {
    const target = franchise.franchiseRenewals.length
      ? franchise.franchiseRenewals[0]
      : franchise;

    return [
      franchise.mvFileNo,
      franchise.plateNo,
      franchise.isExpired,
      franchise.user?.userProfile.reverseFullName,
      target.approvalStatus,
      target.expiryDate,
      target.todaAssociation.name,
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

  const moreStatusInfoText = useMemo(() => {
    if (viewOnly) return null;

    if (approvalStatus === FranchiseApprovalStatus.Approved) {
      const expiryDateText = dayjs(expiryDate).format('YYYY-MM-DD');
      return `valid until ${expiryDateText}`;
    } else if (approvalStatus === FranchiseApprovalStatus.Validated) {
      return 'select to view payment details';
    } else if (
      approvalStatus === FranchiseApprovalStatus.PendingValidation ||
      approvalStatus === FranchiseApprovalStatus.Paid
    ) {
      return 'select to view further actions';
    }

    return null;
  }, [viewOnly, approvalStatus, expiryDate]);

  return (
    <button
      className={cx(
        'relative flex h-80 w-[326px] cursor-pointer flex-col justify-between rounded border border-border bg-backdrop-input px-5 py-4 text-left transition-colors hover:border-primary',
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
            <div className='flex flex-col'>
              <span className='text-base font-medium'>{reverseFullName}</span>
              <small className='uppercase leading-tight'>owner</small>
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
      <div className='flex w-full items-end justify-between'>
        <div className='flex flex-col gap-3'>
          {moreStatusInfoText && (
            <small
              className={cx(
                'text-xs',
                approvalStatus !== FranchiseApprovalStatus.Approved &&
                  'text-green-600',
              )}
            >
              {moreStatusInfoText}
            </small>
          )}
          <span
            className={cx(
              'flex items-center gap-1 text-xl font-bold',
              statusLabelClassName,
            )}
          >
            {statusLabelIconName && (
              <BaseIcon name={statusLabelIconName} size={24} />
            )}
            {statusLabel}
          </span>
        </div>
        <CurrentStatus approvalStatus={approvalStatus} />
      </div>
    </button>
  );
});
