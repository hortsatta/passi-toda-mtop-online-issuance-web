import { forwardRef, memo, useMemo } from 'react';
import cx from 'classix';

import { BaseIcon } from './base-icon.component';

import type { ComponentProps } from 'react';
import type { IconName } from '../models/base.model';

type Props = ComponentProps<'button'> & {
  iconName?: IconName;
  iconSize?: number;
  loading?: boolean;
};

export const BaseButtonSimple = memo(
  forwardRef<HTMLButtonElement, Props>(function (
    { className, iconName, iconSize, disabled, children, ...moreProps },
    ref,
  ) {
    const size = useMemo(() => {
      if (iconSize == null) {
        return children == null ? 24 : 16;
      }

      return iconSize;
    }, [iconSize, children]);

    return (
      <button
        ref={ref}
        type='button'
        className={cx(
          'flex items-center gap-1 uppercase transition-colors hover:text-primary',
          disabled && 'pointer-events-none',
          className,
        )}
        {...moreProps}
      >
        {iconName && <BaseIcon name={iconName} size={size} />}
        {children && <div>{children}</div>}
      </button>
    );
  }),
);
