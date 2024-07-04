import { memo } from 'react';
import cx from 'classix';

import { BaseButtonSimple } from '#/base/components/base-button-simple.component';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  onPrint?: () => void;
  onRefresh?: () => void;
};

export const FranchiseSingleActions = memo(function ({
  className,
  onPrint,
  onRefresh,
  ...moreProps
}: Props) {
  return (
    <div className={cx('flex items-center gap-4', className)} {...moreProps}>
      {onPrint && <BaseButtonSimple iconName='printer' onClick={onPrint} />}
      {onRefresh && (
        <BaseButtonSimple iconName='arrows-clockwise' onClick={onRefresh} />
      )}
    </div>
  );
});
