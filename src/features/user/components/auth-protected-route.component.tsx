import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseLoading } from '#/base/components/base-loading.component';

import type { ReactNode } from 'react';
import type { UserRole } from '../models/user.model';

type Props = {
  children: ReactNode;
  roles?: UserRole[];
  reverse?: boolean;
  redirectTo?: string;
};

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
    return <BaseLoading />;
  }

  if (reverse) {
    return !isRoleValid ? children : <Navigate to={redirectTo} replace />;
  }

  return isRoleValid ? children : <Navigate to={redirectTo} replace />;
}
