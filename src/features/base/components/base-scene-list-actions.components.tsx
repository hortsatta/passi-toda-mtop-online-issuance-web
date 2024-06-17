import { memo } from 'react';
import cx from 'classix';

import { BaseButtonSimple } from './base-button-simple.component';

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
        <BaseButtonSimple
          iconName='arrows-clockwise'
          onClick={onRefreshClick}
        />
      )}
    </div>
  );
});
