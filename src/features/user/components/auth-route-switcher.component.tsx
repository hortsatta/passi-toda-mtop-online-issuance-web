import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseLoading } from '#/base/components/base-loading.component';

import type { ReactNode } from 'react';
import type { UserRole } from '../models/user.model';

type RoleElement = {
  role: UserRole;
  element: ReactNode;
};

type Props = {
  roleElements: RoleElement[];
  redirectTo?: string;
};

export function AuthRouteSwitcher({ roleElements, redirectTo = '/' }: Props) {
  const user = useBoundStore((state) => state.user);

  const element = useMemo(() => {
    if (!user) return null;

    return roleElements.find((role) => role.role === user.role)?.element;
  }, [roleElements, user]);

  if (user === undefined) {
    return <BaseLoading />;
  }

  if (!element) {
    return <Navigate to={redirectTo} replace />;
  }

  return element;
}
