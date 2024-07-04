import { memo, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import cx from 'classix';

import { routeConfig } from '#/config/routes.config';
import { useAuth } from '#/user/hooks/use-auth.hook';
import { AuthSignInFormCompact } from '#/user/components/auth-sign-in-form-compact.component';
import { CurrentUserCard } from '#/user/components/current-user-card.component';
import { BaseLoading } from '#/base/components/base-loading.component';
import { useBoundStore } from '../hooks/use-store.hook';
import { CoreNavMenu } from './core-nav-menu.component';

import logoPng from '#/assets/images/logo.png';

import type { ComponentProps } from 'react';

const appTitle = import.meta.env.VITE_APP_TITLE;
const appDescription = import.meta.env.VITE_APP_DESCRIPTION;

export const CoreHeader = memo(function ({
  className,
  children,
  ...moreProps
}: ComponentProps<'header'>) {
  const { pathname } = useLocation();
  const user = useBoundStore((state) => state.user);
  const { signIn, signOut } = useAuth();

  const isSignInPage = useMemo(
    () => pathname.slice(1) === routeConfig.auth.signIn.to,
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
      <Link to='/' className='flex h-10 items-center gap-3 hover:no-underline'>
        <img src={logoPng} alt='logo' />
        <div className='flex h-full items-center gap-2.5 pt-1 text-text'>
          <h1 className='text-2xl font-medium leading-none'>{appTitle}</h1>
          <div className='h-full border border-text/40' />
          <span className='inline-block w-56 text-xs font-medium leading-normal text-text/60'>
            {appDescription}
          </span>
        </div>
      </Link>
      {children}
      {user !== undefined ? (
        <div className='flex h-full items-center gap-5'>
          {!isSignInPage && !user && (
            <AuthSignInFormCompact onSubmit={signIn} />
          )}
          {user && (
            <>
              <CoreNavMenu role={user.role} />
              <div className='h-3/5 w-px border-r border-border' />
              <CurrentUserCard user={user} signOut={signOut} />
            </>
          )}
        </div>
      ) : (
        <div className='mr-10 flex h-full items-center'>
          <BaseLoading compact />
        </div>
      )}
    </header>
  );
});
