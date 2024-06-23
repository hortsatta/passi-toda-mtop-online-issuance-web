import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import { BaseDataEmptyMessage } from '#/base/components/base-data-empty-message.component';
import { TreasurerFranchiseSingleCard } from './treasurer-franchise-single-card.component';

import type { ComponentProps } from 'react';
import type { FranchiseDigest, Franchise } from '../models/franchise.model';

type Props = ComponentProps<'div'> & {
  franchises: Franchise[];
  franchiseDigest: FranchiseDigest;
  isFiltered?: boolean;
  onFranchiseDetails?: (id: number) => void;
};

type FranchiseSubGroupListProps = {
  franchises: Franchise[];
  headerText?: string;
  onFranchiseDetails?: (id: number) => void;
};

const FranchiseSubGroupList = memo(function ({
  headerText,
  franchises,
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
            <TreasurerFranchiseSingleCard
              key={franchise.id}
              franchise={franchise}
              onDetails={handleFranchiseDetails(franchise.id)}
              role='row'
            />
          ))
        ) : (
          <span className='text-text/50'>Nothing to show</span>
        )}
      </div>
    </div>
  );
});

export const TreasurerFranchiseList = memo(function ({
  className,
  franchises,
  franchiseDigest,
  isFiltered,
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
                headerText='Pending Payments'
                franchises={validatedList}
                onFranchiseDetails={onFranchiseDetails}
              />
              <div className='w-full border-b border-border' />
              <FranchiseSubGroupList
                headerText='Recent Confirmed Payments'
                franchises={paidList}
                onFranchiseDetails={onFranchiseDetails}
              />
            </>
          ) : (
            <FranchiseSubGroupList
              franchises={franchises}
              onFranchiseDetails={onFranchiseDetails}
            />
          )}
        </div>
      )}
    </div>
  );
});
