import { memo } from 'react';
import cx from 'classix';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  pageTitle?: string;
};

export const BaseScene = memo(function ({
  className,
  pageTitle,
  children,
  ...moreProps
}: Props) {
  return (
    <div className={cx('w-full pt-10', className)} {...moreProps}>
      {pageTitle && <h2 className='mb-5'>{pageTitle}</h2>}
      {children}
    </div>
  );
});
