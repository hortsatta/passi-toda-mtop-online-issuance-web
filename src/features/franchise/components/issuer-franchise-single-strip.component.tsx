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

export const IssuerFranchiseSingleStrip = memo(function ({
  className,
  franchise,
  viewOnly,
  onDetails,
  ...moreProps
}: Props) {
  const [
    mvFileNo,
    plateNo,
    approvalStatus,
    expiryDate,
    todaAssociationName,
    isDriverOwner,
    ownerReverseFullName,
    driverReverseFullName,
  ] = useMemo(
    () => [
      franchise.mvFileNo,
      franchise.plateNo,
      franchise.approvalStatus,
      franchise.expiryDate,
      franchise.todaAssociation.name,
      franchise.isDriverOwner,
      franchise.user?.userProfile.reverseFullName,
      franchise.driverProfile?.reverseFullName,
    ],
    [franchise],
  );

  const statusLabel = useMemo(() => {
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
  }, [approvalStatus]);

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
        'relative flex w-full cursor-pointer flex-col justify-between gap-3 rounded border border-border bg-backdrop-input px-5 pb-3 pt-4 text-left transition-colors hover:border-primary',
        className,
      )}
      onClick={onDetails}
      {...moreProps}
    >
      <div className='flex w-full items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <div>
            <h4 className='text-2xl font-bold uppercase leading-tight'>
              {plateNo}
            </h4>
            <small className='uppercase leading-tight'>plate no</small>
          </div>
          <div className='h-12 border-r border-border' />
          <div>
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
              (approvalStatus === FranchiseApprovalStatus.PendingValidation ||
                approvalStatus === FranchiseApprovalStatus.Validated ||
                approvalStatus === FranchiseApprovalStatus.Paid) &&
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
        </div>
      </div>
      <div className='w-full border-b border-border' />
      <div className='flex w-full items-center justify-between gap-4'>
        <div className='flex gap-4'>
          {isDriverOwner ? (
            <div>
              <span className='block font-medium leading-tight'>
                {ownerReverseFullName}
              </span>
              <small className='uppercase leading-tight'>
                owner and driver
              </small>
            </div>
          ) : (
            <>
              <div>
                <span className='block font-medium leading-tight'>
                  {ownerReverseFullName}
                </span>
                <small className='uppercase leading-tight'>owner</small>
              </div>
              <div className='h-8 border-r border-border' />
              <div>
                <span className='block font-medium leading-tight'>
                  {driverReverseFullName}
                </span>
                <small className='uppercase leading-tight'>driver</small>
              </div>
            </>
          )}
        </div>
        <CurrentStatus approvalStatus={approvalStatus} />
      </div>
    </button>
  );
});
