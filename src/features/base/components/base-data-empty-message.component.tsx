import { memo } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classix';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  message: string;
  linkTo?: string;
  linkLabel?: string;
};

export const BaseDataEmptyMessage = memo(function ({
  className,
  message,
  linkTo,
  linkLabel = 'Create New',
  ...moreProps
}: Props) {
  return (
    <div
      className={cx(
        'flex w-full items-center justify-center gap-2.5',
        className,
      )}
      {...moreProps}
    >
      <span>{message}</span>
      {linkTo && <Link to={linkTo}>{linkLabel}</Link>}
    </div>
  );
});
