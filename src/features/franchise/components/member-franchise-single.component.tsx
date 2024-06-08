import { memo, useCallback, useMemo, useState } from 'react';
import cx from 'classix';

import { BaseButton } from '#/base/components/base-button.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { FranchiseApprovalStatus } from '../models/franchise.model';
import { FranchiseDocsModal } from './franchise-docs-modal.component';
import { FranchiseRecord } from './franchise-record.component';

import type { ComponentProps } from 'react';
import type { Franchise } from '../models/franchise.model';

type Props = ComponentProps<'div'> & {
  franchise: Franchise;
  onCancelApplication: () => Promise<Franchise>;
  loading?: boolean;
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
  loading,
  onCancelApplication,
  ...moreProps
}: Props) {
  const [currentImg, setCurrentImg] = useState<{
    src: string | null;
    title?: string;
  }>({
    src: null,
    title: '',
  });

  const approvalStatus = useMemo(() => franchise.approvalStatus, [franchise]);

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

  const handleModalClose = useCallback(() => {
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
            <small
              className={cx(
                'text-xs uppercase',
                (approvalStatus === FranchiseApprovalStatus.Approved ||
                  approvalStatus === FranchiseApprovalStatus.Rejected ||
                  approvalStatus === FranchiseApprovalStatus.Canceled) &&
                  'pl-8',
              )}
            >
              status
            </small>
          </div>
          {approvalStatus !== FranchiseApprovalStatus.Rejected &&
            approvalStatus !== FranchiseApprovalStatus.Canceled && (
              <CurrentStatus approvalStatus={approvalStatus} />
            )}
        </div>
        <div
          className={cx(
            'flex h-0 w-full items-center justify-end gap-2.5 overflow-hidden transition-[height]',
            (approvalStatus === FranchiseApprovalStatus.PendingValidation ||
              approvalStatus === FranchiseApprovalStatus.PendingPayment) &&
              'h-12',
          )}
        >
          <BaseButton
            className={cx(
              'h-full !text-base opacity-0 transition-opacity',
              (approvalStatus === FranchiseApprovalStatus.PendingValidation ||
                approvalStatus === FranchiseApprovalStatus.PendingPayment) &&
                'opacity-100',
            )}
            variant='warn'
            loading={loading}
            disabled={
              approvalStatus !== FranchiseApprovalStatus.PendingValidation &&
              approvalStatus !== FranchiseApprovalStatus.PendingPayment
            }
            onClick={onCancelApplication}
          >
            Cancel Application
          </BaseButton>
        </div>
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
    </>
  );
});
