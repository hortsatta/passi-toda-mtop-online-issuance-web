import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import { routeConfig } from '#/config/routes.config';
import { BaseDataEmptyMessage } from '#/base/components/base-data-empty-message.component';
import { TodaAssociationSingleCard } from './toda-association-single-card.component';

import type { ComponentProps } from 'react';
import type { TodaAssociation } from '../models/toda-association.model';

type Props = ComponentProps<'div'> & {
  todaAssociations: TodaAssociation[];
  onTodaAssociationDetails?: (id: number) => void;
  onTodaAssociationEdit?: (id: number) => void;
};

export const TodaAssociationList = memo(function ({
  className,
  todaAssociations,
  onTodaAssociationDetails,
  onTodaAssociationEdit,
  ...moreProps
}: Props) {
  const isEmpty = useMemo(() => !todaAssociations?.length, [todaAssociations]);

  const handleTodaAssociationDetails = useCallback(
    (id: number) => () => {
      onTodaAssociationDetails && onTodaAssociationDetails(id);
    },
    [onTodaAssociationDetails],
  );

  const handleTodaAssociationEdit = useCallback(
    (id: number) => () => {
      onTodaAssociationEdit && onTodaAssociationEdit(id);
    },
    [onTodaAssociationEdit],
  );

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
          message='No associations to show'
          linkLabel='Add New'
          linkTo={routeConfig.todaAssociation.create.to}
        />
      ) : (
        todaAssociations.map((todaAssociation) => (
          <TodaAssociationSingleCard
            key={todaAssociation.id}
            todaAssociation={todaAssociation}
            onDetails={handleTodaAssociationDetails(todaAssociation.id)}
            onEdit={
              onTodaAssociationEdit
                ? handleTodaAssociationEdit(todaAssociation.id)
                : undefined
            }
            role='row'
          />
        ))
      )}
    </div>
  );
});
