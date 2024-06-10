import { forwardRef, memo, useMemo } from 'react';
import cx from 'classix';

import type { ComponentProps } from 'react';
import type { ButtonVariant } from '#/core/models/core.model';

type Props = ComponentProps<'button'> & {
  variant?: ButtonVariant;
  loading?: boolean;
};

export const BaseButton = memo(
  forwardRef<HTMLButtonElement, Props>(function (
    {
      className,
      loading,
      disabled,
      children,
      variant = 'primary',
      ...moreProps
    },
    ref,
  ) {
    const variantClassName = useMemo(() => {
      let className = '';

      switch (variant) {
        case 'warn':
          className = 'border-[#c33636] bg-[#c94141]';
          break;
        case 'accept':
          className = 'border-[#349c37] bg-[#43ad46]';
          break;
        case 'accent':
          className = 'border-accent-button-hover bg-accent';
          break;
        default:
          className = 'border-primary-button-hover bg-primary';
          break;
      }

      if (!disabled && !loading) {
        switch (variant) {
          case 'warn':
            className = `${className} hover:bg-[#c33636] active:bg-[#cf5151]`;
            break;
          case 'accept':
            className = `${className} hover:bg-[#3aae3d] active:bg-[#4dc450]`;
            break;
          case 'accent':
            className = `${className} hover:bg-accent-button-hover active:!bg-accent`;
            break;
          default:
            className = `${className} hover:bg-primary-button-hover active:!bg-primary`;
            break;
        }
      }

      return className;
    }, [variant, disabled, loading]);

    return (
      <button
        ref={ref}
        type='button'
        className={cx(
          'relative flex h-14 items-center justify-center overflow-hidden rounded border px-7 text-xs font-bold uppercase text-text transition-colors',
          variantClassName,
          disabled && 'grayscale-[0.6]',
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
