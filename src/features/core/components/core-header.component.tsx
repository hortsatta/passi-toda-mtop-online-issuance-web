import { memo } from 'react';
import cx from 'classix';

import type { ComponentProps } from 'react';
import { useBoundStore } from '../hooks/use-store.hook';

export const CoreHeader = memo(function ({
  className,
  children,
  ...moreProps
}: ComponentProps<'header'>) {
  const user = useBoundStore((state) => state.user);

  return (
    <header
      className={cx(
        'flex h-[71px] w-full items-center justify-between bg-backdrop-surface',
        className,
      )}
      {...moreProps}
    >
      {/* TODO logo with hidden h1 */}
      <h1>MTOP Online Issuance</h1>
      {user?.email || 'user'}
      {children}
    </header>
  );
});
