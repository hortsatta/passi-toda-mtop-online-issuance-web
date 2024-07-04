import cx from 'classix';
import { forwardRef, memo, useMemo } from 'react';

import dayjs from '#/config/dayjs.config';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseFieldText } from '#/base/components/base-field-text.component';
import { FranchiseApprovalStatus } from '../models/franchise.model';

import type { ComponentProps } from 'react';
import type { Franchise } from '../models/franchise.model';

type Props = ComponentProps<'div'> & {
  franchise: Franchise;
  // rateSheets: RateSheet[];
  // loading?: boolean;
};

type HoriFieldTextProps = ComponentProps<'div'> & {
  label: string;
};

const HoriFieldText = memo(function ({
  className,
  label,
  children,
  ...moreProps
}: HoriFieldTextProps) {
  return (
    <div
      className={cx(
        'print-border flex w-full items-baseline justify-between gap-2.5 border-b border-border pb-1.5',
        className,
      )}
      {...moreProps}
    >
      <small className='text-xs uppercase leading-tight'>{label}</small>
      <div className='text-lg font-medium leading-none'>{children}</div>
    </div>
  );
});

export const FranchiseSinglePrintView = memo(
  forwardRef<HTMLDivElement, Props>(function (
    { className, franchise, ...moreProps },
    ref,
  ) {
    const [
      user,
      mvFileNo,
      plateNo,
      isExpired,
      createdAtText,
      todaAssociation,
      approvalStatus,
      approvalDate,
      expiryDate,
      activeValidityMonths,
      isDriverOwner,
      driverProfile,
      isRenewal,
    ] = useMemo(() => {
      const target = franchise.franchiseRenewals.length
        ? franchise.franchiseRenewals[0]
        : franchise;

      return [
        franchise.user,
        franchise.mvFileNo,
        franchise.plateNo,
        franchise.isExpired,
        dayjs(target.createdAt).format('MMMM DD, YYYY'),
        target.todaAssociation,
        target.approvalStatus,
        target.approvalDate
          ? dayjs(target.approvalDate).format('MMMM DD, YYYY')
          : null,
        target.expiryDate
          ? dayjs(target.expiryDate).format('MMMM DD, YYYY')
          : null,
        dayjs(target.expiryDate).diff(target.approvalDate, 'months'),
        target.isDriverOwner,
        target.driverProfile,
        !!franchise.franchiseRenewals.length,
      ];
    }, [franchise]);

    const [todaName, todaAuthorizedRoute] = useMemo(
      () => [todaAssociation.name, todaAssociation.authorizedRoute],
      [todaAssociation],
    );

    const [ownerReverseFullName, ownerPhoneNumber, ownerEmail] = useMemo(
      () => [
        user?.userProfile.reverseFullName || '',
        user?.userProfile.phoneNumber || '',
        user?.email || '',
      ],
      [user],
    );

    const [driverReverseFullName, driverPhoneNumber, driverEmail] =
      useMemo(() => {
        if (isDriverOwner) return [];

        return [
          driverProfile?.reverseFullName || '',
          driverProfile?.phoneNumber || '',
          driverProfile?.email || '',
        ];
      }, [isDriverOwner, driverProfile]);

    const headerTitle = useMemo(
      () => (isRenewal ? 'Franchise Renewal' : 'Franchise Registration'),
      [isRenewal],
    );

    const statusLabel = useMemo(() => {
      if (isExpired) return 'Franchise Expired';

      switch (approvalStatus) {
        case FranchiseApprovalStatus.Validated:
          return 'Pending Payment';
        case FranchiseApprovalStatus.Paid:
          return 'Pending Approval';
        case FranchiseApprovalStatus.Approved:
          return 'Franchise Approved';
        case FranchiseApprovalStatus.Rejected:
          return 'Franchise Rejected';
        case FranchiseApprovalStatus.Canceled:
          return 'Franchise Canceled';
        case FranchiseApprovalStatus.Revoked:
          return 'Franchise Revoked';
        default:
          return 'Pending Verfication';
      }
    }, [approvalStatus, isExpired]);

    const statusLabelIconName = useMemo(() => {
      if (isExpired) return 'x-circle';

      switch (approvalStatus) {
        case FranchiseApprovalStatus.Validated:
        case FranchiseApprovalStatus.Paid:
        case FranchiseApprovalStatus.Approved:
          return 'check-circle';
        case FranchiseApprovalStatus.Rejected:
        case FranchiseApprovalStatus.Canceled:
        case FranchiseApprovalStatus.Revoked:
          return 'x-circle';
        default:
          return 'cube-focus';
      }
    }, [approvalStatus, isExpired]);

    return (
      <div
        ref={ref}
        className={cx(
          'content-wrapper flex w-full flex-col gap-10 rounded bg-backdrop-surface px-16 py-12',
          className,
        )}
        {...moreProps}
      >
        <div className='flex items-start justify-between gap-2.5'>
          <h2 className='flex-1 text-2xl'>{headerTitle}</h2>
          <BaseFieldText
            className='!w-fit max-w-[170px] flex-none text-right'
            label='Created On'
            isPrint
          >
            {createdAtText}
          </BaseFieldText>
        </div>
        <div className='print-border border-b border-border' />
        <div className='flex w-full items-start justify-between'>
          <div className='flex items-center gap-2'>
            <BaseIcon name={statusLabelIconName} size={30} />
            <span className='text-xl font-medium'>{statusLabel}</span>
          </div>
          {approvalStatus === FranchiseApprovalStatus.Approved ||
          approvalStatus === FranchiseApprovalStatus.Revoked ? (
            <div className='flex w-fit flex-col items-end gap-2.5'>
              <HoriFieldText label='Granted On'>{approvalDate}</HoriFieldText>
              <HoriFieldText label='Valid Until'>{expiryDate}</HoriFieldText>
              <HoriFieldText label='Validity Period'>
                {activeValidityMonths} Months
              </HoriFieldText>
            </div>
          ) : (
            <div className='flex w-fit flex-col items-start gap-1'>
              <small className='flex items-center gap-1 text-base uppercase'>
                <BaseIcon
                  name={
                    approvalStatus === FranchiseApprovalStatus.Validated ||
                    approvalStatus === FranchiseApprovalStatus.Paid
                      ? 'check-circle'
                      : 'x-circle'
                  }
                  size={20}
                />
                verified
              </small>
              <small className='flex items-center gap-1 text-base uppercase'>
                <BaseIcon
                  name={
                    approvalStatus === FranchiseApprovalStatus.Paid
                      ? 'check-circle'
                      : 'x-circle'
                  }
                  size={20}
                />
                paid
              </small>
              <small className='flex items-center gap-1 text-base uppercase'>
                <BaseIcon name='x-circle' size={20} />
                approved
              </small>
            </div>
          )}
        </div>
        <div className='print-border border-b border-border' />
        <div className='print-border flex w-full flex-col gap-4 rounded-sm border border-border p-3'>
          <h4 className='text-base font-normal uppercase'>Vehicle Info</h4>
          <div className='flex w-full items-center gap-4'>
            <BaseFieldText label='MV File No' isPrint>
              {mvFileNo}
            </BaseFieldText>
            <BaseFieldText label='Plate No' isPrint>
              {plateNo}
            </BaseFieldText>
          </div>
        </div>
        <div className='print-border flex w-full flex-col gap-4 rounded-sm border border-border p-3'>
          <h4 className='text-base font-normal uppercase'>
            TODA Association Info
          </h4>
          <div className='flex w-full items-center gap-4'>
            <BaseFieldText label='Name' isPrint>
              {todaName}
            </BaseFieldText>
            <BaseFieldText label='Authorized Route' isPrint>
              {todaAuthorizedRoute}
            </BaseFieldText>
          </div>
        </div>
        <div className='print-border flex w-full flex-col gap-4 rounded-sm border border-border p-3'>
          <h4 className='text-base font-normal uppercase'>
            {isDriverOwner ? 'Operator and Driver Info' : 'Operator Info'}
          </h4>
          <div className='flex w-full items-center gap-4'>
            <BaseFieldText label='Name' isPrint>
              {ownerReverseFullName}
            </BaseFieldText>
            <BaseFieldText label='Phone No.' isPrint>
              {ownerPhoneNumber}
            </BaseFieldText>
            <BaseFieldText label='Email' isPrint>
              {ownerEmail}
            </BaseFieldText>
          </div>
        </div>
        {!isDriverOwner && (
          <div className='print-border flex w-full flex-col gap-4 rounded-sm border border-border p-3'>
            <h4 className='text-base font-normal uppercase'>Driver Info</h4>
            <div className='flex w-full items-center gap-4'>
              <BaseFieldText label='Name' isPrint>
                {driverReverseFullName}
              </BaseFieldText>
              <BaseFieldText label='Phone No.' isPrint>
                {driverPhoneNumber}
              </BaseFieldText>
              <BaseFieldText label='Email' isPrint>
                {driverEmail}
              </BaseFieldText>
            </div>
          </div>
        )}
      </div>
    );
  }),
);
