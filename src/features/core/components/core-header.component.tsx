import { memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import cx from 'classix';

import { routeConfig } from '#/config/routes.config';
import { useAuth } from '#/user/hooks/use-auth.hook';
import { AuthSignInFormCompact } from '#/user/components/auth-sign-in-form-compact.component';
import { CurrentUserCard } from '#/user/components/current-user-card.component';
import { useBoundStore } from '../hooks/use-store.hook';

import type { ComponentProps } from 'react';

export const CoreHeader = memo(function ({
  className,
  children,
  ...moreProps
}: ComponentProps<'header'>) {
  const { pathname } = useLocation();
  const user = useBoundStore((state) => state.user);
  const { signOut } = useAuth();

  const isSignInPage = useMemo(
    () => pathname.slice(1) === routeConfig.authSignIn.to,
    [pathname],
  );

  return (
    <header
      className={cx(
        'flex h-[71px] w-full items-center justify-between bg-backdrop-surface px-5',
        className,
      )}
      {...moreProps}
    >
      {/* TODO logo with hidden h1 */}
      <h1>MTOP Online Issuance</h1>
      {children}
      {user !== undefined && (
        <div>
          {!isSignInPage && !user && <AuthSignInFormCompact />}
          {user && <CurrentUserCard user={user} signOut={signOut} />}
        </div>
      )}
    </header>
  );
});
