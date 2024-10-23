import { memo, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseBadge } from '#/base/components/base-badge.component';
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
      <div className='flex items-end gap-2.5'>
        <small className='flex items-center gap-1 text-sm uppercase text-red-500'>
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
    approvalDate,
    expiryDate,
    todaAssociationName,
    driverReverseFullName,
    isRenewal,
  ] = useMemo(() => {
    const target = franchise.franchiseRenewals.length
      ? franchise.franchiseRenewals[0]
      : franchise;

    return [
      franchise.mvFileNo.toUpperCase(),
      franchise.plateNo.toUpperCase(),
      franchise.isExpired,
      franchise.canRenew,
      target.approvalStatus,
      target.approvalDate,
      target.expiryDate,
      target.todaAssociation.name,
      target.isDriverOwner
        ? userProfile?.reverseFullName
        : target.driverProfile?.reverseFullName,
      !!franchise.franchiseRenewals.length,
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
    } else if (approvalStatus === FranchiseApprovalStatus.Rejected) {
      return ['select to view details', 'text-green-600'];
    } else if (
      approvalStatus === FranchiseApprovalStatus.PendingValidation ||
      approvalStatus === FranchiseApprovalStatus.Paid ||
      approvalStatus === FranchiseApprovalStatus.Canceled
    ) {
      return [registrationRenewalText, null];
    }

    return [null, null];
  }, [approvalStatus, isExpired, canRenew, isRenewal]);

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
        'relative flex w-full cursor-pointer flex-col justify-between gap-3 rounded border border-border bg-backdrop-input px-5 pb-3 pt-4 text-left transition-colors hover:border-primary',
        className,
      )}
      onClick={onDetails}
      {...moreProps}
    >
      <div className='flex min-h-[57px] w-full items-center justify-between gap-4'>
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
              <BaseBadge className={moreStatusInfoTextClassName || ''}>
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
                {approvalDateText && <BaseBadge>{approvalDateText}</BaseBadge>}
                {expiryDateText &&
                  approvalStatus === FranchiseApprovalStatus.Approved && (
                    <BaseBadge>{expiryDateText}</BaseBadge>
                  )}
              </div>
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
