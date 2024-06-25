import { memo } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classix';

import { BaseIcon } from './base-icon.component';

import type { ComponentProps, ReactNode } from 'react';

type Props = ComponentProps<'div'> & {
  pageTitle?: string;
  backTo?: string;
  rightComponent?: ReactNode;
};

export const BaseScene = memo(function ({
  className,
  pageTitle,
  backTo,
  rightComponent,
  children,
  ...moreProps
}: Props) {
  return (
    <div className={cx('w-full pb-10 pt-10', className)} {...moreProps}>
      <div
        className={cx(
          'mb-5 flex w-full items-center justify-between gap-5',
          (pageTitle || backTo || !!rightComponent) && 'mb-5',
        )}
      >
        <div className='flex items-center gap-5'>
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
        {!!rightComponent && (
          <div className='flex items-center'>{rightComponent}</div>
        )}
      </div>
      {children}
    </div>
  );
});
