import { memo, useMemo } from 'react';

import { BaseButton } from '#/base/components/base-button.component';
import { convertToCurrency } from '#/core/helpers/core.helper';
import { FeeType } from '#/rate-sheet/models/rate-sheet.model';
import { FranchiseApprovalStatus } from '../models/franchise.model';

import type { ComponentProps } from 'react';
import type { ButtonVariant } from '#/base/models/base.model';
import type { RateSheet } from '#/rate-sheet/models/rate-sheet.model';
import type { Franchise } from '../models/franchise.model';

type Props = ComponentProps<'div'> & {
  franchise: Franchise;
  rateSheet: RateSheet;
  onApproveFranchise: () => void;
  isUserClient?: boolean;
  loading?: boolean;
  isApprove?: boolean;
  isTreasurer?: boolean;
};

export const FranchiseApplicationActions = memo(function ({
  loading,
  isUserClient,
  isApprove,
  isTreasurer,
  franchise,
  rateSheet,
  onApproveFranchise,
  ...moreProps
}: Props) {
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

      const baseMessage = `Mark client's application for franchise ${rateSheet.feeType === FeeType.FranchiseRegistration ? 'registration' : 'renewal'} as`;

      const approvalStatus = franchise.franchiseRenewals.length
        ? franchise.franchiseRenewals[0].approvalStatus
        : franchise.approvalStatus;

      switch (approvalStatus) {
        case FranchiseApprovalStatus.PendingValidation:
          return `${baseMessage} verified and invoice the client with a total amount of ${totalAmountText}?`;
        case FranchiseApprovalStatus.Validated:
          return `${baseMessage} paid?`;
        case FranchiseApprovalStatus.Paid:
          return `Approve franchise?`;
        default:
          return '';
      }
    } else {
      return isUserClient
        ? 'Cancel application?'
        : `Reject client's application?`;
    }
  }, [isApprove, isUserClient, franchise, rateSheet]);

  const [buttonVariant, buttonLabel] = useMemo(() => {
    const approvalStatus = franchise.franchiseRenewals.length
      ? franchise.franchiseRenewals[0].approvalStatus
      : franchise.approvalStatus;

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
      return isUserClient
        ? ['warn', ' Cancel Application']
        : ['warn', ' Reject Application'];
    }
  }, [isApprove, isUserClient, isTreasurer, franchise]);

  return (
    <div className='flex flex-col justify-between gap-10' {...moreProps}>
      <p className='text-base'>{description}</p>
      <BaseButton
        className='w-full !text-base'
        variant={buttonVariant as ButtonVariant}
        loading={loading}
        onClick={onApproveFranchise}
      >
        {buttonLabel}
      </BaseButton>
    </div>
  );
});
