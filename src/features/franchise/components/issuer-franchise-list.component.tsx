import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import { BaseDataEmptyMessage } from '#/base/components/base-data-empty-message.component';
import { IssuerFranchiseSingleCard } from './issuer-franchise-single-card.component';

import type { ComponentProps } from 'react';
import type { FranchiseDigest, Franchise } from '../models/franchise.model';

type Props = ComponentProps<'div'> & {
  franchises: Franchise[];
  franchiseDigest: FranchiseDigest;
  viewOnly?: boolean;
  isFiltered?: boolean;
  onFranchiseDetails?: (id: number) => void;
};

type FranchiseSubGroupListProps = {
  franchises: Franchise[];
  headerText?: string;
  viewOnly?: boolean;
  onFranchiseDetails?: (id: number) => void;
};

const FranchiseSubGroupList = memo(function ({
  headerText,
  franchises,
  viewOnly,
  onFranchiseDetails,
}: FranchiseSubGroupListProps) {
  const handleFranchiseDetails = useCallback(
    (id: number) => () => {
      onFranchiseDetails && onFranchiseDetails(id);
    },
    [onFranchiseDetails],
  );

  return (
    <div className='flex flex-col gap-4'>
      {!!headerText?.length && <h4>{headerText}</h4>}
      <div className='flex flex-wrap gap-4'>
        {franchises.length ? (
          franchises.map((franchise) => (
            <IssuerFranchiseSingleCard
              key={franchise.id}
              franchise={franchise}
              onDetails={handleFranchiseDetails(franchise.id)}
              role='row'
              viewOnly={viewOnly}
            />
          ))
        ) : (
          <span className='text-text/50'>Nothing to show</span>
        )}
      </div>
    </div>
  );
});

export const IssuerFranchiseList = memo(function ({
  className,
  franchises,
  franchiseDigest,
  isFiltered,
  viewOnly,
  onFranchiseDetails,
  ...moreProps
}: Props) {
  const {
    pendingValidations,
    validatedList,
    paidList,
    recentApprovals,
    recentRejections,
  } = franchiseDigest;

  const isEmpty = useMemo(
    () =>
      ![
        ...pendingValidations,
        ...validatedList,
        ...paidList,
        ...recentApprovals,
        ...recentRejections,
      ].length,
    [
      pendingValidations,
      validatedList,
      paidList,
      recentApprovals,
      recentRejections,
    ],
  );

  return (
    <div
      className={cx(
        'w-full rounded bg-backdrop-surface px-16 py-12',
        className,
      )}
      role='table'
      {...moreProps}
    >
      {isEmpty ? (
        <BaseDataEmptyMessage message='No franchises to show' />
      ) : (
        <div className='flex flex-col gap-10'>
          {!isFiltered ? (
            <>
              <FranchiseSubGroupList
                headerText='Pending Applications'
                franchises={[
                  ...pendingValidations,
                  ...validatedList,
                  ...paidList,
                ]}
                onFranchiseDetails={onFranchiseDetails}
                viewOnly={viewOnly}
              />
              <div className='w-full border-b border-border' />
              <FranchiseSubGroupList
                headerText='Recent Approvals'
                franchises={recentApprovals}
                onFranchiseDetails={onFranchiseDetails}
                viewOnly={viewOnly}
              />
              <div className='w-full border-b border-border' />
              <FranchiseSubGroupList
                headerText='Recent Rejections'
                franchises={recentRejections}
                onFranchiseDetails={onFranchiseDetails}
                viewOnly={viewOnly}
              />
            </>
          ) : (
            <FranchiseSubGroupList
              franchises={franchises}
              onFranchiseDetails={onFranchiseDetails}
              viewOnly={viewOnly}
            />
          )}
        </div>
      )}
    </div>
  );
});
