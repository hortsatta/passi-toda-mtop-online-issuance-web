import { memo, useMemo } from 'react';
import cx from 'classix';

import { BaseIcon } from '#/base/components/base-icon.component';
import { FranchiseApprovalStatus } from '../models/franchise.model';

import type { ComponentProps } from 'react';
import type { Franchise } from '../models/franchise.model';

type Props = ComponentProps<'div'> & {
  franchise: Franchise;
};

type CurrentStatusProps = {
  approvalStatus: FranchiseApprovalStatus;
};

const CurrentStatus = memo(function ({ approvalStatus }: CurrentStatusProps) {
  return (
    <div className='flex items-center gap-2.5'>
      {approvalStatus === FranchiseApprovalStatus.PendingValidation && (
        <small className='animate-pulse text-base uppercase text-orange-500'>
          verifying application
        </small>
      )}
      {approvalStatus !== FranchiseApprovalStatus.PendingValidation && (
        <>
          <small
            className={cx(
              'flex items-center gap-1 text-base uppercase',
              approvalStatus === FranchiseApprovalStatus.PendingPayment ||
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
        </>
      )}
    </div>
  );
});

export const MemberFranchiseSingle = memo(function ({
  className,
  franchise,
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
          <small className='text-xs uppercase'>status</small>
        </div>
        {approvalStatus !== FranchiseApprovalStatus.Rejected &&
          approvalStatus !== FranchiseApprovalStatus.Canceled && (
            <CurrentStatus approvalStatus={approvalStatus} />
          )}
      </div>
      <div className='my-2.5 w-full border-b border-border' />
      <div className='flex w-full flex-col'>
        <div className='flex items-start justify-between'>
          <div className='flex flex-col gap-5'>
            <div className='flex flex-col'>
              <h4 className='text-3xl font-bold uppercase leading-tight'>
                {plateNo}
              </h4>
              <small className='text-xs uppercase leading-tight'>
                plate no
              </small>
            </div>
            <div className='flex flex-col'>
              <span className='text-lg font-medium'>{mvFileNo}</span>
              <small className='text-xs uppercase leading-tight'>
                mv file no
              </small>
            </div>
          </div>
          <div className='items-right flex flex-col'>
            <span className='text-right text-lg font-medium'>
              {todaAssociationName}
            </span>
            <small className='text-xs uppercase leading-tight'>
              association
            </small>
          </div>
        </div>
      </div>
    </div>
  );
});
