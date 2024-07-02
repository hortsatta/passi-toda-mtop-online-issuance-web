import { memo } from 'react';
import cx from 'classix';

import type { ComponentProps } from 'react';

export const BaseBadge = memo(function ({
  className,
  ...moreProps
}: ComponentProps<'div'>) {
  return (
    <div
      className={cx(
        'inline-block w-fit overflow-hidden rounded-sm border border-border bg-backdrop-input px-2.5 py-1.5 text-xs',
        className,
      )}
      {...moreProps}
    />
  );
});
