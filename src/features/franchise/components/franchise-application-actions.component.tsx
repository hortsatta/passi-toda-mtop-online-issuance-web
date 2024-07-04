import { memo, useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import cx from 'classix';

import { convertToCurrency } from '#/core/helpers/core.helper';
import { BaseBadge } from '#/base/components/base-badge.component';
import { BaseButton } from '#/base/components/base-button.component';
import { BaseTextarea } from '#/base/components/base-textarea.component';
import { FeeType } from '#/rate-sheet/models/rate-sheet.model';
import { FranchiseApprovalStatus } from '../models/franchise.model';

import type { ChangeEvent, ComponentProps } from 'react';
import type { ButtonVariant } from '#/base/models/base.model';
import type { RateSheet } from '#/rate-sheet/models/rate-sheet.model';
import type { Franchise } from '../models/franchise.model';
import type { FranchiseStatusFieldError } from '../models/franchise-status-remark.model';
import { BaseInput } from '#/base/components/base-input.component';

type Props = ComponentProps<'div'> & {
  franchise: Franchise;
  rateSheet: RateSheet;
  fieldErrors?: FranchiseStatusFieldError[];
  loading?: boolean;
  isUserClient?: boolean;
  isApprove?: boolean;
  isTreasurer?: boolean;
  onApproveFranchise?: (remarks?: string) => void;
  onApproveTreasurerFranchise?: (paymentORNo: string) => void;
};

export const FranchiseApplicationActions = memo(function ({
  loading,
  isUserClient,
  isApprove,
  isTreasurer,
  franchise,
  rateSheet,
  fieldErrors,
  onApproveFranchise,
  onApproveTreasurerFranchise,
  ...moreProps
}: Props) {
  const approvalStatus = useMemo(() => {
    const target = franchise.franchiseRenewals.length
      ? franchise.franchiseRenewals[0]
      : franchise;

    return target.approvalStatus;
  }, [franchise]);

  const [remarks, setRemarks] = useState<string | undefined>(
    isUserClient ? '' : undefined,
  );

  const [paymentORNo, setPaymentORNo] = useState<string | undefined>(undefined);

  const [remarksError, setRemarksError] = useState<string | undefined>(
    undefined,
  );

  const [paymentORNoError, setPaymentORNoError] = useState<string | undefined>(
    undefined,
  );

  const description = useMemo(() => {
    if (isApprove) {
      const rateSheetFeeAmount = rateSheet.rateSheetFees
        .filter((fee) => !fee.isPenalty)
        .reduce((total, current) => current.amount + total, 0);

      const rateSheetPenaltyFeeAmount = rateSheet.rateSheetFees
        .filter((fee) => fee.isPenalty && fee.isPenaltyActive)
        .reduce((total, current) => current.amount + total, 0);

      const totalAmountText = convertToCurrency(
        rateSheetFeeAmount + rateSheetPenaltyFeeAmount,
      );

      const baseMessage = `Please provide the Official Receipt number to mark the client's application for franchise ${rateSheet.feeType === FeeType.FranchiseRegistration ? 'registration' : 'renewal'} as`;

      switch (approvalStatus) {
        case FranchiseApprovalStatus.PendingValidation:
          return `${baseMessage} verified and invoice the client with a total amount of ${totalAmountText}?`;
        case FranchiseApprovalStatus.Validated:
          return `${baseMessage} paid`;
        case FranchiseApprovalStatus.Paid:
          return `Approve franchise?`;
        default:
          return '';
      }
    } else {
      if (isUserClient)
        return 'Please provide your remarks on why the application is being canceled (optional).';

      return `Please provide your remarks on why the ${approvalStatus === FranchiseApprovalStatus.Approved ? 'franchise' : 'application'} is being ${approvalStatus === FranchiseApprovalStatus.Approved ? 'revoked' : 'rejected'}.`;
    }
  }, [isApprove, isUserClient, approvalStatus, rateSheet]);

  const [buttonVariant, buttonLabel] = useMemo(() => {
    if (isApprove) {
      switch (approvalStatus) {
        case FranchiseApprovalStatus.PendingValidation:
          return ['primary', 'Verify Application'];
        case FranchiseApprovalStatus.Validated:
          return [isTreasurer ? 'accept' : 'primary', 'Confirm Payment'];
        case FranchiseApprovalStatus.Paid:
          return ['accept', 'Approve Franchise'];
        default:
          return [];
      }
    } else {
      if (isUserClient) return ['warn', ' Cancel Application'];

      return approvalStatus === FranchiseApprovalStatus.Approved
        ? ['warn', ' Revoke Application']
        : ['warn', ' Reject Application'];
    }
  }, [isApprove, isUserClient, isTreasurer, approvalStatus]);

  const handleRemarksChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = event.target;
      setRemarks(value);
      value?.length && setRemarksError(undefined);
    },
    [setRemarks],
  );

  const handlePaymentORNoChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setPaymentORNo(value);
      value?.length && setRemarksError(undefined);
    },
    [setPaymentORNo],
  );

  const handleApproveFranchise = useCallback(() => {
    if (!isUserClient && !remarks?.length) {
      setRemarksError('error');
      toast.error('Remarks is required');
      return;
    }

    onApproveFranchise && onApproveFranchise(remarks);
  }, [isUserClient, remarks, onApproveFranchise]);

  const handleApproveTreasurerFranchise = useCallback(() => {
    if (!isTreasurer) return;

    if (!paymentORNo?.length) {
      setPaymentORNoError('error');
      toast.error('OR number is required');
      return;
    }

    onApproveTreasurerFranchise && onApproveTreasurerFranchise(paymentORNo);
  }, [isTreasurer, paymentORNo, onApproveTreasurerFranchise]);

  return (
    <div
      className={cx('flex w-full flex-col justify-between gap-10')}
      {...moreProps}
    >
      <div className='flex flex-col gap-4'>
        <p className='text-base'>{description}</p>
        {isApprove && isTreasurer && (
          <BaseInput
            label='Official Receipt No'
            value={paymentORNo || ''}
            onChange={handlePaymentORNoChange}
            errorMessage={paymentORNoError}
            hideErrorMessage
            asterisk
            fullWidth
          />
        )}
        {!isApprove && (
          <BaseTextarea
            placeholder='Remarks'
            value={remarks || ''}
            onChange={handleRemarksChange}
            asterisk={!isUserClient}
            errorMessage={remarksError}
            hideErrorMessage
            fullWidth
          />
        )}
      </div>
      {!isUserClient &&
        !isApprove &&
        approvalStatus !== FranchiseApprovalStatus.Approved && (
          <div className='flex flex-col gap-4'>
            <span className='text-base'>Highlighted fields with issue</span>
            <div className='flex flex-wrap items-center gap-2'>
              {fieldErrors?.length
                ? fieldErrors.map((fe) => (
                    <BaseBadge key={fe.name}>{fe.label}</BaseBadge>
                  ))
                : 'None selected'}
            </div>
          </div>
        )}
      <BaseButton
        className='w-full !text-base'
        variant={buttonVariant as ButtonVariant}
        loading={loading}
        onClick={
          isTreasurer ? handleApproveTreasurerFranchise : handleApproveFranchise
        }
      >
        {buttonLabel}
      </BaseButton>
    </div>
  );
});
