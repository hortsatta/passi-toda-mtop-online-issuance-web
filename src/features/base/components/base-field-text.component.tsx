import { memo } from 'react';
import cx from 'classix';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  label: string;
  name?: string;
  error?: boolean;
};

export const BaseFieldText = memo(function ({
  className,
  label,
  children,
  error,
  onClick,
  ...moreProps
}: Props) {
  return (
    <div
      className={cx(
        'flex h-fit flex-1 flex-col gap-2.5 rounded border bg-backdrop-input px-4 pb-2.5 pt-4 transition-colors',
        onClick && 'cursor-pointer hover:border-primary',
        error ? 'border-red-600' : 'border-transparent',
        className,
      )}
      onClick={onClick}
      {...moreProps}
    >
      <div className='text-lg font-medium leading-none'>{children}</div>
      <div className='border-b border-border' />
      <small
        className={cx(
          'text-xs uppercase leading-tight',
          error && 'text-red-500',
        )}
      >
        {label}
      </small>
    </div>
  );
});
