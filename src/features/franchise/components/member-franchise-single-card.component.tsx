import { memo, useMemo } from 'react';
import cx from 'classix';

import { BaseIcon } from '#/base/components/base-icon.component';
import { FranchiseApprovalStatus } from '../models/franchise.model';

import type { ComponentProps } from 'react';
import type { Franchise } from '../models/franchise.model';

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
  return (
    <div className='flex flex-col gap-0.5'>
      {approvalStatus === FranchiseApprovalStatus.PendingValidation && (
        <small className='animate-pulse text-xs uppercase text-orange-500'>
          verifying application
        </small>
      )}
      {(approvalStatus === FranchiseApprovalStatus.PendingPayment ||
        approvalStatus === FranchiseApprovalStatus.Approved) && (
        <small className='flex items-center gap-1 text-xs uppercase text-green-500'>
          <BaseIcon name='check-circle' size={16} />
          verified
        </small>
      )}
      {approvalStatus === FranchiseApprovalStatus.Approved && (
        <>
          <small className='flex items-center gap-1 text-xs uppercase text-green-500'>
            <BaseIcon name='check-circle' size={16} />
            paid
          </small>
          <small className='flex items-center gap-1 text-xs uppercase text-green-500'>
            <BaseIcon name='check-circle' size={16} />
            approved
          </small>
        </>
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
  const [mvFileNo, plateNo, approvalStatus, expiryDate, todaAssociationName] =
    useMemo(
      () => [
        franchise.mvFileNo,
        franchise.plateNo,
        franchise.approvalStatus,
        franchise.expiryDate,
        franchise.todaAssociation.name,
      ],
      [franchise],
    );

  const statusLabel = useMemo(() => {
    switch (approvalStatus) {
      case FranchiseApprovalStatus.PendingPayment:
        return 'Pending Payment';
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

  return (
    <button
      className={cx(
        'relative flex h-60 w-[326px] flex-shrink-0 cursor-pointer flex-col justify-between rounded border border-border bg-backdrop-input px-5 py-4 text-left transition-colors hover:border-primary',
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
      <div className='flex w-full items-end justify-between'>
        <span
          className={cx(
            'flex items-center gap-1 text-xl font-bold',
            approvalStatus === FranchiseApprovalStatus.PendingPayment &&
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
        <CurrentStatus approvalStatus={approvalStatus} />
      </div>
    </button>
  );
});
