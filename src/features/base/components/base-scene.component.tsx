import { memo } from 'react';
import cx from 'classix';

import type { ComponentProps } from 'react';

export const BaseScene = memo(function ({
  className,
  ...moreProps
}: ComponentProps<'div'>) {
  return <div className={cx('w-full', className)} {...moreProps} />;
});
