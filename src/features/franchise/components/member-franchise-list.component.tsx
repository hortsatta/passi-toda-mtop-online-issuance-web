import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import { routeConfig } from '#/config/routes.config';
import { BaseDataEmptyMessage } from '#/base/components/base-data-empty-message.component';
import { MemberFranchiseSingleStrip } from './member-franchise-single-strip.component';
import { MemberFranchiseSingleCard } from './member-franchise-single-card.component';

import type { ComponentProps } from 'react';
import type { ListView } from '#/base/models/base.model';
import type { Franchise } from '../models/franchise.model';

type Props = ComponentProps<'div'> & {
  listView: ListView;
  franchises: Franchise[];
  onFranchiseDetails?: (id: number) => void;
  // onFranchiseEdit?: (id: number) => void;
};

export const MemberFranchiseList = memo(function ({
  className,
  listView,
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
        'flex w-full rounded bg-backdrop-surface px-4 py-5 lg:px-16 lg:py-12',
        listView === 'strip' ? 'flex-col gap-2.5' : 'flex-wrap gap-4',
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
        franchises.map((franchise) =>
          listView === 'strip' ? (
            <MemberFranchiseSingleStrip
              key={franchise.id}
              franchise={franchise}
              onDetails={handleFranchiseDetails(franchise.id)}
              role='row'
            />
          ) : (
            <MemberFranchiseSingleCard
              key={franchise.id}
              franchise={franchise}
              onDetails={handleFranchiseDetails(franchise.id)}
              role='row'
            />
          ),
        )
      )}
    </div>
  );
});
