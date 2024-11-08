import { memo } from 'react';
import cx from 'classix';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  label: string;
  name?: string;
  center?: boolean;
  error?: boolean;
  isPrint?: boolean;
};

export const BaseFieldText = memo(function ({
  className,
  label,
  children,
  center,
  error,
  isPrint,
  onClick,
  ...moreProps
}: Props) {
  return (
    <div
      className={cx(
        'flex h-fit flex-1 flex-col rounded border bg-backdrop-input transition-colors',
        onClick && 'cursor-pointer hover:border-primary',
        center && 'items-center',
        error ? 'border-red-600' : 'border-transparent',
        isPrint
          ? 'gap-1 bg-transparent p-0'
          : 'gap-2.5 bg-backdrop-input px-4 pb-2.5 pt-4',
        className,
      )}
      onClick={onClick}
      {...moreProps}
    >
      <div
        className={cx(
          'font-medium leading-none',
          isPrint ? 'text-base' : 'text-lg',
        )}
      >
        {children}
      </div>
      <div
        className={cx(
          'border-b border-border',
          center && 'w-full',
          isPrint && 'print-border',
        )}
      />
      <small
        className={cx(
          'text-xs uppercase leading-tight',
          center && 'text-center',
          error && 'text-red-500',
        )}
      >
        {label}
      </small>
    </div>
  );
});
