import { memo, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import cx from 'classix';

import {
  baseMemberRoute,
  routeConfig,
  userBaseTo,
} from '#/config/routes.config';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseButton } from '#/base/components/base-button.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseFieldText } from '#/base/components/base-field-text.component';
import { BaseLoading } from '#/base/components/base-loading.component';
import { UserRole } from '#/user/models/user.model';
import { FranchiseApprovalStatus } from '../models/franchise.model';

import type { ComponentProps } from 'react';
import type { Franchise } from '../models/franchise.model';

type Props = ComponentProps<'div'> & {
  mvPlateNo: string;
  franchise?: Franchise | null;
  loading?: boolean;
};

type FranchiseInfoProps = {
  mvPlateNo: string;
  franchise?: Franchise | null;
};

const FRANCHISE_REGISTER_TO = `/${baseMemberRoute}/${routeConfig.franchise.to}/${routeConfig.franchise.create.to}`;
const AUTH_SIGN_IN_TO = `/${routeConfig.authSignIn.to}`;

const FranchiseInfo = memo(function ({
  mvPlateNo,
  franchise,
}: FranchiseInfoProps) {
  const user = useBoundStore((state) => state.user);
  const navigate = useNavigate();

  const [id, mvFileNo, plateNo, isExpired, ownerReverseFullName, isOwner] =
    useMemo(
      () =>
        !franchise
          ? []
          : [
              franchise.id,
              franchise.mvFileNo,
              franchise.plateNo,
              franchise.isExpired,
              franchise.user?.userProfile.reverseFullName,
              (user?.role === UserRole.Member &&
                franchise.user?.email === user?.email) ||
                user?.role !== UserRole.Member,
            ],
      [franchise, user],
    );

  const approvalStatus = useMemo(() => {
    if (!franchise) return null;

    return franchise.franchiseRenewals?.length
      ? franchise.franchiseRenewals[0].approvalStatus
      : franchise.approvalStatus;
  }, [franchise]);

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
        return 'Pending';
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

  const handleRegisterClick = useCallback(() => {
    const to = !user ? AUTH_SIGN_IN_TO : FRANCHISE_REGISTER_TO;
    const state = {
      value: mvPlateNo,
      type: mvPlateNo.length < 15 ? 'plateNo' : 'mvFileNo',
    };

    navigate(to, { state });
  }, [mvPlateNo, user, navigate]);

  const handleViewFranchiseClick = useCallback(() => {
    if (!user) return;

    const to = `${userBaseTo[user.role]}/${routeConfig.franchise.to}/${id}`;

    navigate(to);
  }, [user, id, navigate]);

  if (franchise === undefined) {
    return (
      <div className='flex h-full w-full items-center justify-center opacity-30'>
        <BaseIcon name='tire' size={64} weight='light' />
      </div>
    );
  }

  if (franchise === null) {
    return (
      <div className='flex flex-col gap-2.5'>
        <p className='text-base'>
          {mvPlateNo.length < 15 ? 'Plate' : 'MV File'} no{' '}
          <span className='font-bold'>{mvPlateNo}</span> not yet registered.
        </p>
        {(!user || user?.role === UserRole.Member) && (
          <BaseButton className='w-full max-w-60' onClick={handleRegisterClick}>
            Register Vehicle
          </BaseButton>
        )}
      </div>
    );
  }

  return (
    <div className='items-left flex w-full flex-col gap-2.5'>
      <div className='w-full overflow-hidden rounded'>
        <BaseFieldText label='MV File No'>{mvFileNo}</BaseFieldText>
        <BaseFieldText label='Plate No'>{plateNo}</BaseFieldText>
        <BaseFieldText label='Owner'>{ownerReverseFullName}</BaseFieldText>
        <span
          className={cx(
            'flex items-center gap-1 bg-backdrop-input px-4 pb-4 pt-2.5 text-base',
            statusLabelClassName,
          )}
        >
          {statusLabelIconName && (
            <BaseIcon name={statusLabelIconName} size={20} />
          )}
          {statusLabel}
        </span>
      </div>
      <div>
        {!user && (
          <p className='text-base'>
            <Link to={AUTH_SIGN_IN_TO}>Sign in</Link> to view franchise details.
          </p>
        )}
        {isOwner && (
          <BaseButton
            className='flex w-full max-w-60 items-center gap-2.5'
            onClick={handleViewFranchiseClick}
          >
            View Franchise
          </BaseButton>
        )}
      </div>
    </div>
  );
});

export const FranchiseCheckerInfo = memo(function ({
  className,
  loading,
  mvPlateNo,
  franchise,
  ...moreProps
}: Props) {
  return (
    <div
      className={cx('flex min-h-24 flex-col gap-4', className)}
      {...moreProps}
    >
      <h4>Franchise Status</h4>
      {loading ? (
        <BaseLoading compact />
      ) : (
        <FranchiseInfo mvPlateNo={mvPlateNo} franchise={franchise} />
      )}
    </div>
  );
});
