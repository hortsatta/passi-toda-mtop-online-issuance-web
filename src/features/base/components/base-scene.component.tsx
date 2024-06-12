import { memo } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classix';

import { BaseIcon } from './base-icon.component';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  pageTitle?: string;
  backTo?: string;
};

export const BaseScene = memo(function ({
  className,
  pageTitle,
  backTo,
  children,
  ...moreProps
}: Props) {
  return (
    <div className={cx('w-full pt-10', className)} {...moreProps}>
      {(pageTitle || backTo) && (
        <div className='mb-5 flex items-center gap-5'>
          {backTo && (
            <Link to={backTo} className='pl-0 transition-[padding] hover:pl-5'>
              <BaseIcon
                name='arrow-left'
                size={24}
                weight='bold'
                className='fill-text'
              />
            </Link>
          )}
          {pageTitle && <h2>{pageTitle}</h2>}
        </div>
      )}
      {children}
    </div>
  );
});
