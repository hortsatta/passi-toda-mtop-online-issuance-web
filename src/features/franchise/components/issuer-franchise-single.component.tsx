import { memo, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { capitalize } from '#/core/helpers/string.helper';
import { BaseButton } from '#/base/components/base-button.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { FranchiseApprovalStatus } from '../models/franchise.model';

import type { ComponentProps } from 'react';
import type { Franchise } from '../models/franchise.model';

type Props = ComponentProps<'div'> & {
  franchise: Franchise;
  onApproveFranchise: (
    approvalStatus?: FranchiseApprovalStatus,
  ) => Promise<Franchise>;
  loading?: boolean;
};

type CurrentStatusProps = {
  approvalStatus: FranchiseApprovalStatus;
};

const VALUE_CLASSNAME = 'text-lg font-medium';
const LABEL_CLASSNAME = 'text-xs uppercase leading-tight';

const CurrentStatus = memo(function ({ approvalStatus }: CurrentStatusProps) {
  return (
    <div className='flex items-center gap-2.5'>
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
    </div>
  );
});

export const IssuerFranchiseSingle = memo(function ({
  className,
  loading,
  franchise,
  onApproveFranchise,
  ...moreProps
}: Props) {
  const [
    mvFileNo,
    plateNo,
    approvalStatus,
    expiryDate,
    todaAssociationName,
    ownerReverseFullName,
    ownerBirthDate,
    ownerGender,
    ownerPhoneNumber,
    ownerDriverLicenseNo,
  ] = useMemo(
    () => [
      franchise.mvFileNo,
      franchise.plateNo,
      franchise.approvalStatus,
      franchise.expiryDate,
      franchise.todaAssociation.name,
      franchise.user?.userProfile.reverseFullName || '',
      dayjs(franchise.user?.userProfile.birthDate || '').format('MMM DD, YYYY'),
      capitalize(franchise.user?.userProfile.gender || ''),
      franchise.user?.userProfile.phoneNumber || '',
      franchise.ownerDriverLicenseNo,
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
      default:
        return 'Pending Verification';
    }
  }, [approvalStatus]);

  const buttonLabel = useMemo(() => {
    switch (approvalStatus) {
      case FranchiseApprovalStatus.PendingValidation:
        return 'Mark Application as Verified';
      case FranchiseApprovalStatus.PendingPayment:
        return 'Approve Franchise';
      default:
        return null;
    }
  }, [approvalStatus]);

  const generateApprovalToast = useCallback(
    (status: FranchiseApprovalStatus) => {
      switch (status) {
        case FranchiseApprovalStatus.PendingPayment:
          toast.success(
            'Application verified and awaiting payment from client',
          );
          return;
        case FranchiseApprovalStatus.Approved:
          toast.success('Franchise approved and active');
          return;
        default:
          toast.error('Application rejected');
          return;
      }
    },
    [],
  );

  const handleApproveFranchise = useCallback(
    (status?: FranchiseApprovalStatus) => async () => {
      try {
        const result = await onApproveFranchise(status);
        generateApprovalToast(result.approvalStatus);
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [onApproveFranchise, generateApprovalToast],
  );

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
              (approvalStatus === FranchiseApprovalStatus.PendingValidation ||
                approvalStatus === FranchiseApprovalStatus.PendingPayment) &&
                'text-yellow-500',
              approvalStatus === FranchiseApprovalStatus.Approved &&
                'text-green-600',
              approvalStatus === FranchiseApprovalStatus.Rejected &&
                'text-red-600',
            )}
          >
            {approvalStatus === FranchiseApprovalStatus.Approved && (
              <BaseIcon name='check-circle' size={24} />
            )}
            {approvalStatus === FranchiseApprovalStatus.Rejected && (
              <BaseIcon name='x-circle' size={24} />
            )}
            {statusLabel}
          </span>
          <small className='pl-8 text-xs uppercase'>status</small>
        </div>
        {approvalStatus !== FranchiseApprovalStatus.Rejected && (
          <CurrentStatus approvalStatus={approvalStatus} />
        )}
      </div>
      <div
        className={cx(
          'flex h-0 w-full items-center justify-between gap-2.5 overflow-hidden transition-[height]',
          buttonLabel && 'h-16',
        )}
      >
        <BaseButton
          className={cx(
            'h-full min-w-[210px] !text-base opacity-0 transition-opacity',
            buttonLabel && 'opacity-100',
          )}
          variant={
            franchise.approvalStatus === FranchiseApprovalStatus.PendingPayment
              ? 'accept'
              : 'primary'
          }
          loading={loading}
          disabled={!buttonLabel}
          onClick={handleApproveFranchise()}
        >
          {buttonLabel}
        </BaseButton>
        <BaseButton
          className={cx(
            '!text-sm opacity-0 transition-opacity',
            buttonLabel && 'opacity-100',
          )}
          variant='warn'
          loading={loading}
          disabled={!buttonLabel}
          onClick={handleApproveFranchise(FranchiseApprovalStatus.Rejected)}
        >
          Reject Application
        </BaseButton>
      </div>
      <div className='my-2.5 w-full border-b border-border' />
      <div className='flex w-full items-start justify-between gap-4'>
        <div className='flex min-h-[400px] flex-1 flex-col gap-4 rounded border border-border bg-backdrop-input px-8 pb-8 pt-6'>
          <h4>Vehicle Info</h4>
          <div className='flex flex-col gap-5'>
            <div className='flex flex-col'>
              <span className={VALUE_CLASSNAME}>{plateNo}</span>
              <small className={LABEL_CLASSNAME}>plate no</small>
            </div>
            <div className='flex flex-col'>
              <span className={VALUE_CLASSNAME}>{mvFileNo}</span>
              <small className={LABEL_CLASSNAME}>mv file no</small>
            </div>
            <div className='flex flex-col'>
              <span className={VALUE_CLASSNAME}>{todaAssociationName}</span>
              <small className={LABEL_CLASSNAME}>association</small>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-4 px-8 pb-8 pt-6'>
          <h4>Owner Info</h4>
          <div className='flex flex-col gap-5'>
            <div className='flex flex-col'>
              <span className={VALUE_CLASSNAME}>{ownerReverseFullName}</span>
              <small className={LABEL_CLASSNAME}>name</small>
            </div>
            <div className='flex flex-col'>
              <span className={VALUE_CLASSNAME}>{ownerBirthDate}</span>
              <small className={LABEL_CLASSNAME}>date of birth</small>
            </div>
            <div className='flex flex-col'>
              <span className={VALUE_CLASSNAME}>{ownerGender}</span>
              <small className={LABEL_CLASSNAME}>gender</small>
            </div>
            <div className='flex flex-col'>
              <span className={VALUE_CLASSNAME}>{ownerPhoneNumber}</span>
              <small className={LABEL_CLASSNAME}>phone number</small>
            </div>
            <div className='flex flex-col'>
              <span className={VALUE_CLASSNAME}>{ownerDriverLicenseNo}</span>
              <small className={LABEL_CLASSNAME}>driver's license</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
