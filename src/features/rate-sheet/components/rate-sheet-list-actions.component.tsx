import { memo } from 'react';
import cx from 'classix';

import { BaseButtonSimple } from '#/base/components/base-button-simple.component';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  onRefresh?: () => void;
};

export const RateSheetListActions = memo(function ({
  className,
  onRefresh,
  ...moreProps
}: Props) {
  return (
    <div className={cx('flex items-center gap-4', className)} {...moreProps}>
      {onRefresh && (
        <BaseButtonSimple iconName='arrows-clockwise' onClick={onRefresh} />
      )}
    </div>
  );
});
