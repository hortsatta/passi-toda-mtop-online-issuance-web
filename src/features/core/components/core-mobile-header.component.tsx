import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import cx from 'classix';

import { routeConfig } from '#/config/routes.config';
import { useAuth } from '#/user/hooks/use-auth.hook';
import { BaseButton } from '#/base/components/base-button.component';
import { CurrentUserCard } from '#/user/components/current-user-card.component';
import { useBoundStore } from '../hooks/use-store.hook';
import { CoreMobileNavMenu } from './core-mobile-nav-menu.component';

import type { ComponentProps } from 'react';

export const CoreMobileHeader = memo(function ({
  className,
  children,
  ...moreProps
}: ComponentProps<'div'>) {
  const navigate = useNavigate();
  const user = useBoundStore((state) => state.user);
  const { signOut } = useAuth();

  const handleSignIn = useCallback(() => {
    navigate(`/${routeConfig.auth.signIn.to}`);
  }, [navigate]);

  return (
    <div
      className={cx(
        'absolute left-0 top-[71px] z-10 flex h-[calc(100vh-71px)] w-full flex-col border-t border-border bg-backdrop-surface p-4 lg:hidden',
        className,
      )}
      {...moreProps}
    >
      <div className='mx-auto h-full w-full max-w-full flex-1 overflow-y-scroll sm:max-w-96'>
        {user !== undefined && (
          <>
            {!user && (
              <BaseButton className='w-full' onClick={handleSignIn}>
                Sign In
              </BaseButton>
            )}
            {user && (
              <div className='flex w-full flex-col gap-4'>
                <CoreMobileNavMenu role={user.role} />
                <div className='w-full border-b border-border' />
                <CurrentUserCard
                  className='self-end'
                  user={user}
                  signOut={signOut}
                />
              </div>
            )}
          </>
        )}
      </div>
      {children}
      <h4 className='pb-2.5 pt-4 text-center text-sm font-normal uppercase opacity-60'>
        Main Menu
      </h4>
    </div>
  );
});
