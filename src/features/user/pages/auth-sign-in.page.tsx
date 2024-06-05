import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { BaseScene } from '#/base/components/base-scene.component';
import { AuthSignInForm } from '../components/auth-sign-in-form.component';

export function AuthSignInPage() {
  const { state } = useLocation();
  const email = useMemo(() => state?.email, [state]);

  return (
    <BaseScene className='mx-auto max-w-[500px]' pageTitle='Sign In'>
      <AuthSignInForm email={email} />
    </BaseScene>
  );
}
