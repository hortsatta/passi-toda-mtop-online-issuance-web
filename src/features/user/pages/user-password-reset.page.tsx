import { routeConfig } from '#/config/routes.config';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseLoading } from '#/base/components/base-loading.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { UserPasswordResetForm } from '../components/user-password-reset-form.component';
import { useUserPasswordReset } from '../hooks/use-user-password-reset.hook';

export function UserPasswordResetPage() {
  const { loading, resetLoading, isResetDone, isVerified, passwordReset } =
    useUserPasswordReset();

  return (
    <BaseScene
      className='mx-auto max-w-[500px]'
      pageTitle={routeConfig.auth.password.reset.pageTitle}
    >
      {loading ? (
        <BaseLoading className='h-full' />
      ) : isVerified ? (
        <UserPasswordResetForm
          loading={resetLoading}
          isDone={isResetDone}
          onSubmit={passwordReset}
        />
      ) : (
        <div className='flex w-full items-center justify-center gap-2.5 py-2.5'>
          <BaseIcon name='x-circle' size={46} className='text-red-500' />
          <div>
            <h4>Request for password reset has expired</h4>
            <span>
              Please request another by using "forgot password" on sign-in.
            </span>
          </div>
        </div>
      )}
    </BaseScene>
  );
}
