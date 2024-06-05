import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';

import { useBoundStore } from '#/core/hooks/use-store.hook';

import type { ReactNode } from 'react';
import type { UserRole } from '../models/user.model';

type Props = {
  children: ReactNode;
  roles?: UserRole[];
  reverse?: boolean;
  redirectTo?: string;
};

const CLASSNAME_ORB = 'relative w-5 h-5 bg-text/50 rounded-full';

export function AuthProtectedRoute({
  roles,
  reverse,
  children,
  redirectTo = '/',
}: Props) {
  const user = useBoundStore((state) => state.user);

  const isRoleValid = useMemo(() => {
    if (user == null) {
      return false;
    }

    return roles?.length ? roles?.some((role) => role === user.role) : true;
  }, [user, roles]);

  if (user === undefined) {
    return (
      <div className='flex h-screen w-full items-center justify-center'>
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
  }

  if (reverse) {
    return !isRoleValid ? children : <Navigate to={redirectTo} replace />;
  }

  return isRoleValid ? children : <Navigate to={redirectTo} replace />;
}
