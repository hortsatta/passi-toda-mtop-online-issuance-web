import { memo } from 'react';
import cx from 'classix';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  label: string;
};

export const BaseFieldText = memo(function ({
  className,
  label,
  children,
  ...moreProps
}: Props) {
  return (
    <div
      className={cx(
        'flex h-fit flex-1 flex-col gap-2.5 rounded bg-backdrop-input px-4 pb-2.5 pt-4',
        className,
      )}
      {...moreProps}
    >
      <div className='text-lg font-medium leading-none'>{children}</div>
      <div className='border-b border-border' />
      <small className='text-xs uppercase leading-tight'>{label}</small>
    </div>
  );
});
