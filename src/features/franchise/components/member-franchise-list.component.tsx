import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import { routeConfig } from '#/config/routes.config';
import { BaseDataEmptyMessage } from '#/base/components/base-data-empty-message.component';
import { MemberFranchiseSingleCard } from './member-franchise-single-card.component';

import type { ComponentProps } from 'react';
import type { Franchise } from '../models/franchise.model';

type Props = ComponentProps<'div'> & {
  franchises: Franchise[];
  onFranchiseDetails?: (id: number) => void;
  // onFranchiseEdit?: (id: number) => void;
};

export const MemberFranchiseList = memo(function ({
  className,
  franchises,
  onFranchiseDetails,
  ...moreProps
}: Props) {
  const isEmpty = useMemo(() => !franchises?.length, [franchises]);

  const handleFranchiseDetails = useCallback(
    (id: number) => () => {
      onFranchiseDetails && onFranchiseDetails(id);
    },
    [onFranchiseDetails],
  );

  // const handleFranchiseEdit = useCallback(
  //   (slug: string) => () => {
  //     onFranchiseEdit && onFranchiseEdit(slug);
  //   },
  //   [onFranchiseEdit],
  // );

  return (
    <div
      className={cx(
        'flex w-full flex-wrap gap-4 rounded bg-backdrop-surface px-16 py-12',
        className,
      )}
      role='table'
      {...moreProps}
    >
      {isEmpty ? (
        <BaseDataEmptyMessage
          message='No franchises to show'
          linkLabel='Register New'
          linkTo={routeConfig.franchise.create.to}
        />
      ) : (
        franchises.map((franchise) => (
          <MemberFranchiseSingleCard
            key={franchise.id}
            franchise={franchise}
            onDetails={handleFranchiseDetails(franchise.id)}
            role='row'
          />
        ))
      )}
    </div>
  );
});
