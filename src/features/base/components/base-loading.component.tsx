import { memo } from 'react';
import cx from 'classix';

import type { ComponentProps } from 'react';

const CLASSNAME_ORB_BASE = 'relative bg-text/50 rounded-full';
const CLASSNAME_ORB = `${CLASSNAME_ORB_BASE} w-5 h-5`;
const CLASSNAME_ORB_COMPACT = `${CLASSNAME_ORB_BASE} w-2.5 h-2.5`;

type Props = ComponentProps<'div'> & {
  compact?: boolean;
};

export const BaseLoading = memo(function ({
  className,
  compact,
  ...moreProps
}: Props) {
  return (
    <div
      className={cx(
        'flex w-full items-center justify-center',
        compact ? 'h-auto' : 'h-screen',
        className,
      )}
      {...moreProps}
    >
      <div className={cx('flex items-center gap-2.5', !compact && '-mt-40')}>
        <div
          className={cx(
            'animate-[bounce_1s_linear_infinite]',
            compact ? CLASSNAME_ORB_COMPACT : CLASSNAME_ORB,
          )}
        />
        <div
          className={cx(
            'animate-[bounce_1s_linear_0.2s_infinite]',
            compact ? CLASSNAME_ORB_COMPACT : CLASSNAME_ORB,
          )}
        />
        <div
          className={cx(
            'animate-[bounce_1s_linear_0.4s_infinite]',
            compact ? CLASSNAME_ORB_COMPACT : CLASSNAME_ORB,
          )}
        />
      </div>
    </div>
  );
});
