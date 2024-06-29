import { memo, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { useBoundStore } from '#/core/hooks/use-store.hook';
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
    <div className='flex items-center gap-2.5'>
      {approvalStatus === FranchiseApprovalStatus.PendingValidation ? (
        <small className='animate-pulse text-xs uppercase text-orange-500'>
          verifying application
        </small>
      ) : (
        <>
          <small
            className={cx(
              'flex items-center gap-1 text-sm uppercase',
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
          <div className='w-8 border-b border-border' />
          <small
            className={cx(
              'flex items-center gap-1 text-sm uppercase',
              approvalStatus === FranchiseApprovalStatus.Paid ||
                approvalStatus === FranchiseApprovalStatus.Approved
                ? 'text-green-500'
                : 'text-text/40',
            )}
          >
            <BaseIcon name='check-circle' size={16} />
            paid
          </small>
          <div className='w-8 border-b border-border' />
          <small
            className={cx(
              'flex items-center gap-1 text-sm uppercase',
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

export const MemberFranchiseSingleStrip = memo(function ({
  className,
  franchise,
  onDetails,
  ...moreProps
}: Props) {
  const userProfile = useBoundStore((state) => state.user?.userProfile);

  const [
    mvFileNo,
    plateNo,
    isExpired,
    canRenew,
    approvalStatus,
    expiryDate,
    todaAssociationName,
    driverReverseFullName,
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
      target.expiryDate,
      target.todaAssociation.name,
      target.isDriverOwner
        ? userProfile?.reverseFullName
        : target.driverProfile?.reverseFullName,
    ];
  }, [franchise, userProfile]);

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
    if (approvalStatus === FranchiseApprovalStatus.Approved && canRenew) {
      if (canRenew) {
        return ['select to renew franchise', 'text-green-600'];
      } else if (isExpired && !canRenew) {
        return [
          'franchise has fully expired, renewal not possible',
          'text-red-600',
        ];
      }
    } else if (approvalStatus === FranchiseApprovalStatus.Validated) {
      return ['select to view payment details', 'text-green-600'];
    }

    return [null, null];
  }, [approvalStatus, isExpired, canRenew]);

  const expiryDateText = useMemo(() => {
    if (approvalStatus !== FranchiseApprovalStatus.Approved) return null;
    const date = dayjs(expiryDate).format('YYYY-MM-DD');
    return `valid until ${date}`;
  }, [approvalStatus, expiryDate]);

  return (
    <button
      className={cx(
        'relative flex w-full cursor-pointer flex-col justify-between gap-3 rounded border border-border bg-backdrop-input px-5 pb-3 pt-4 text-left transition-colors hover:border-primary',
        className,
      )}
      onClick={onDetails}
      {...moreProps}
    >
      <div className='flex w-full items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <div className='min-w-[80px]'>
            <h4 className='text-2xl font-bold uppercase leading-tight'>
              {plateNo}
            </h4>
            <small className='uppercase leading-tight'>plate no</small>
          </div>
          <div className='h-12 border-r border-border' />
          <div className='min-w-[200px]'>
            <span className='block text-2xl font-medium leading-tight'>
              {mvFileNo}
            </span>
            <small className='uppercase leading-tight'>mv file no</small>
          </div>
          <div className='h-12 border-r border-border' />
          <div>
            <span className='block text-lg font-medium leading-tight'>
              {todaAssociationName}
            </span>
            <small className='uppercase leading-tight'>association</small>
          </div>
        </div>
        <div className='flex flex-col items-end gap-1.5'>
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
          <div className='flex items-center gap-2.5'>
            {moreStatusInfoText && (
              <>
                <small className={cx('text-xs', moreStatusInfoTextClassName)}>
                  {moreStatusInfoText}
                </small>
                <div className='h-6 border-r border-border' />
              </>
            )}
            {expiryDateText && (
              <small className='text-xs'>{expiryDateText}</small>
            )}
          </div>
        </div>
      </div>
      <div className='w-full border-b border-border' />
      <div className='flex w-full items-center justify-between gap-4'>
        <div>
          <span className='block font-medium leading-tight'>
            {driverReverseFullName}
          </span>
          <small className='uppercase leading-tight'>driver</small>
        </div>
        <CurrentStatus approvalStatus={approvalStatus} />
      </div>
    </button>
  );
});
