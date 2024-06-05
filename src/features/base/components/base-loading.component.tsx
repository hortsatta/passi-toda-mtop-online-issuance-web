import { memo } from 'react';
import cx from 'classix';

import type { ComponentProps } from 'react';

const CLASSNAME_ORB = 'relative w-5 h-5 bg-text/50 rounded-full';

export const BaseLoading = memo(function ({
  className,
  ...moreProps
}: ComponentProps<'div'>) {
  return (
    <div
      className={cx(
        'flex h-screen w-full items-center justify-center',
        className,
      )}
      {...moreProps}
    >
      <div className='-mt-40 flex items-center gap-2.5'>
        <div
          className={`${CLASSNAME_ORB} animate-[bounce_1s_linear_infinite]`}
        />
        <div
          className={`${CLASSNAME_ORB} animate-[bounce_1s_linear_0.2s_infinite]`}
        />
        <div
          className={`${CLASSNAME_ORB} animate-[bounce_1s_linear_0.4s_infinite]`}
        />
      </div>
    </div>
  );
});
