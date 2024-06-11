import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import { BaseButtonIcon } from '#/base/components/base-button-icon.component';

import type { ComponentProps, MouseEvent } from 'react';
import type { TodaAssociation } from '../models/toda-association.model';

type Props = ComponentProps<'div'> & {
  todaAssociation: TodaAssociation;
  onDetails?: () => void;
  onEdit?: () => void;
};

export const TodaAssociationSingleCard = memo(function ({
  className,
  todaAssociation,
  onDetails,
  onEdit,
  ...moreProps
}: Props) {
  const { name, authorizedRoute, presidentReverseFullName } = useMemo(
    () => todaAssociation,
    [todaAssociation],
  );

  const handleEdit = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onEdit && onEdit();
    },
    [onEdit],
  );

  return (
    <div
      className={cx(
        'w-full cursor-pointer rounded border border-border bg-backdrop-input px-5 py-4 text-left transition-colors hover:border-primary',
        className,
      )}
      onClick={onDetails}
      role='button'
      {...moreProps}
    >
      <div className='relative flex w-full flex-col gap-2.5'>
        <div className='absolute right-0 top-0'>
          {/* TODO view franchises under association */}
          {onEdit && (
            <BaseButtonIcon iconName='pencil-simple' onClick={handleEdit} />
          )}
        </div>
        <div className='flex flex-col'>
          <h4 className='text-2xl'>{name}</h4>
          <span className='text-lg'>{authorizedRoute} Route</span>
        </div>
        <span className='text-base'>
          <i className='not-italic'>President:</i> {presidentReverseFullName}
        </span>
      </div>
    </div>
  );
});
