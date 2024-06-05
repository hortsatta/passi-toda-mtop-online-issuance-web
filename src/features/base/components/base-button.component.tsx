import { forwardRef, memo } from 'react';
import cx from 'classix';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'button'> & {
  loading?: boolean;
};

export const BaseButton = memo(
  forwardRef<HTMLButtonElement, Props>(function (
    { className, loading, disabled, children, ...moreProps },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type='button'
        className={cx(
          'relative flex h-14 items-center justify-center overflow-hidden rounded border border-primary-button-hover bg-primary px-7 text-xs font-bold uppercase text-text transition-colors',
          disabled && 'grayscale-[0.6]',
          !disabled &&
            !loading &&
            'hover:bg-primary-button-hover active:!bg-primary',
          className,
        )}
        disabled={disabled || loading}
        {...moreProps}
      >
        {loading && (
          <div className='absolute left-0 top-0 z-10 h-full w-1/4 animate-loading bg-white/30' />
        )}
        {children}
      </button>
    );
  }),
);
