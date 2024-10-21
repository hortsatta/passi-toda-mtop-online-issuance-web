import { routeConfig } from '#/config/routes.config';
import { BaseScene } from '#/base/components/base-scene.component';
import { useUserPasswordForgot } from '../hooks/use-user-password-forgot.hook';
import { UserPasswordForgotForm } from '../components/user-password-forgot-form.component';

export function UserPasswordForgotPage() {
  const { loading, isEmailSent, passwordForgot } = useUserPasswordForgot();

  return (
    <BaseScene
      className='mx-auto max-w-[500px]'
      pageTitle={routeConfig.auth.password.forgot.pageTitle}
    >
      <UserPasswordForgotForm
        loading={loading}
        isEmailSent={isEmailSent}
        onSubmit={passwordForgot}
      />
    </BaseScene>
  );
}
