import { memo, useMemo } from 'react';

import { BaseButton } from '#/base/components/base-button.component';
import { CENTAVOS } from '#/core/helpers/core.helper';
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
};

export const FranchiseApplicationActions = memo(function ({
  loading,
  isUserClient,
  isApprove,
  franchise,
  rateSheet,
  onApproveFranchise,
  ...moreProps
}: Props) {
  const description = useMemo(() => {
    if (isApprove) {
      const total = (
        rateSheet.rateSheetFees.reduce(
          (total, current) => current.amount + total,
          0,
        ) / CENTAVOS
      ).toFixed(2);

      if (
        franchise.approvalStatus === FranchiseApprovalStatus.PendingValidation
      ) {
        return `Mark client's application for franchise ${rateSheet.feeType === FeeType.FranchiseRegistration ? 'registration' : 'renewal'} as verified and invoice the client with a total amount of ₱${total}?`;
      } else if (
        franchise.approvalStatus === FranchiseApprovalStatus.PendingPayment
      ) {
        return `Mark client's application as paid and approve franchise?`;
      }
    } else {
      return isUserClient
        ? 'Cancel application?'
        : `Reject client's application?`;
    }

    return '';
  }, [isApprove, isUserClient, franchise, rateSheet]);

  const [buttonVariant, buttonLabel] = useMemo(() => {
    if (isApprove) {
      if (
        franchise.approvalStatus === FranchiseApprovalStatus.PendingValidation
      ) {
        return ['primary', 'Verify Application'];
      } else if (
        franchise.approvalStatus === FranchiseApprovalStatus.PendingPayment
      ) {
        return ['accept', 'Approve Franchise'];
      }
    } else {
      return isUserClient
        ? ['warn', ' Cancel Application']
        : ['warn', ' Reject Application'];
    }

    return [];
  }, [isApprove, isUserClient, franchise]);

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
