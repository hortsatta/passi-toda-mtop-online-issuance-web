import { Link } from 'react-router-dom';

import { routeConfig } from '#/config/routes.config';
import { BaseLoading } from '#/base/components/base-loading.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { useAuthConfirmRegistration } from '../hooks/use-auth-confirm-registration.hook';

export function AuthConfirmRegistrationPage() {
  const { loading, isConfirmed } = useAuthConfirmRegistration();

  return (
    <BaseScene
      className='mx-auto w-full max-w-[800px]'
      pageTitle={routeConfig.auth.confirmRegistration.pageTitle}
    >
      <div className='flex min-h-64 flex-col items-center justify-center gap-5 overflow-hidden rounded bg-backdrop-surface px-4 py-5 lg:px-16 lg:py-12'>
        {loading ? (
          <BaseLoading compact />
        ) : (
          <>
            <span className='text-lg'>
              {isConfirmed
                ? 'Registration completed, you can now sign in.'
                : 'Cannot verify account, link has expired.'}
            </span>
            <Link to='/' className='text-base'>
              Back to Home
            </Link>
          </>
        )}
      </div>
    </BaseScene>
  );
}
