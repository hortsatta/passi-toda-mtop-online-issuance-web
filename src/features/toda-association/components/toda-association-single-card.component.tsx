import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import { BaseButtonIcon } from '#/base/components/base-button-icon.component';

import type { ComponentProps, MouseEvent } from 'react';
import type { TodaAssociation } from '../models/toda-association.model';

type Props = ComponentProps<'div'> & {
  todaAssociation: TodaAssociation;
  onDetails?: () => void;
  onEdit?: () => void;
  onFranchiseView?: () => void;
};

export const TodaAssociationSingleCard = memo(function ({
  className,
  todaAssociation,
  onDetails,
  onEdit,
  onFranchiseView,
  ...moreProps
}: Props) {
  const { name, authorizedRoute, presidentReverseFullName, franchiseCount } =
    useMemo(() => todaAssociation, [todaAssociation]);

  const handleEdit = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onEdit && onEdit();
    },
    [onEdit],
  );

  const handleFranchiseView = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onFranchiseView && onFranchiseView();
    },
    [onFranchiseView],
  );

  return (
    <div
      className={cx(
        'flex w-full cursor-pointer items-center justify-between gap-3 rounded border border-border bg-backdrop-input px-5 py-4 transition-colors hover:border-primary',
        className,
      )}
      onClick={onDetails}
      role='button'
      {...moreProps}
    >
      <div className='flex w-full flex-col gap-3'>
        <div className='relative flex w-full items-center gap-4'>
          <div>
            <h4 className='text-2xl font-bold uppercase leading-tight'>
              {name}
            </h4>
            <small className='uppercase leading-tight'>Name</small>
          </div>
          <div className='h-12 border-r border-border' />
          <div>
            <span className='block text-2xl font-medium leading-tight'>
              {authorizedRoute}
            </span>
            <small className='uppercase leading-tight'>Route</small>
          </div>
        </div>
        <div className='w-full border-b border-border' />
        <div className='flex gap-4'>
          <div>
            <span className='block font-medium leading-tight'>
              {presidentReverseFullName}
            </span>
            <small className='uppercase leading-tight'>President</small>
          </div>
        </div>
      </div>
      <div className='flex h-full gap-4'>
        <button
          className={cx(
            'flex h-full min-w-28 flex-col items-center justify-center gap-1 rounded bg-backdrop-input px-4',
            onFranchiseView && 'transition-colors hover:bg-primary',
          )}
          onClick={handleFranchiseView}
        >
          <span className='block text-5xl font-medium leading-tight'>
            {franchiseCount}
          </span>
          <small className='text-sm uppercase leading-tight'>Franchises</small>
        </button>
        {onEdit && (
          <>
            <div className='h-full border-r border-border' />
            <BaseButtonIcon iconName='pencil-simple' onClick={handleEdit} />
          </>
        )}
      </div>
    </div>
  );
});
