import { memo } from 'react';
import cx from 'classix';

import { BaseIcon } from './base-icon.component';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  onRefreshClick?: () => void;
};

export const BaseSceneListActions = memo(function ({
  className,
  onRefreshClick,
  ...moreProps
}: Props) {
  return (
    <div className={cx('flex items-center gap-2.5', className)} {...moreProps}>
      {onRefreshClick && (
        <button className='group/refresh' onClick={onRefreshClick}>
          <BaseIcon
            name='arrows-clockwise'
            size={24}
            weight='bold'
            className='fill-text transition-colors group-hover/refresh:fill-primary'
          />
        </button>
      )}
    </div>
  );
});
