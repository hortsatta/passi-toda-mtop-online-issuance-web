import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  baseAdminRoute,
  baseIssuerRoute,
  baseMemberRoute,
  routeConfig,
} from '#/config/routes.config';
import { BaseScene } from '#/base/components/base-scene.component';
import { UserRole } from '../models/user.model';
import { useAuth } from '../hooks/use-auth.hook';
import { AuthSignInForm } from '../components/auth-sign-in-form.component';

import type { AuthCredentials } from '../models/auth.model';

export function AuthSignInPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { signIn } = useAuth();

  const { email, value, type } = useMemo(() => state || {}, [state]);

  const handleSubmit = useCallback(
    async (data: AuthCredentials) => {
      const user = await signIn(data);

      if (value?.length && type?.length && user.role === UserRole.Member) {
        const state = { value, type };
        const to = `/${baseMemberRoute}/${routeConfig.franchise.to}/${routeConfig.franchise.create.to}`;

        navigate(to, { state });
      } else {
        const baseTo = {
          [UserRole.Member]: baseMemberRoute,
          [UserRole.Issuer]: baseIssuerRoute,
          [UserRole.Admin]: baseAdminRoute,
        };

        navigate(`/${baseTo[user.role]}/${routeConfig.franchise.to}`);
      }
    },
    [value, type, signIn, navigate],
  );

  return (
    <BaseScene
      className='mx-auto max-w-[500px]'
      pageTitle={routeConfig.authSignIn.pageTitle}
    >
      <AuthSignInForm email={email} onSubmit={handleSubmit} />
    </BaseScene>
  );
}
