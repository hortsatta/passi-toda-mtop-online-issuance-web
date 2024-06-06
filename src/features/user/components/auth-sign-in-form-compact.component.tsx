import { memo, useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import cx from 'classix';

import {
  baseIssuerRoute,
  baseMemberRoute,
  routeConfig,
} from '#/config/routes.config';
import { BaseButton } from '#/base/components/base-button.component';
import { BaseButtonIcon } from '#/base/components/base-button-icon.component';
import { BaseControlledInput } from '#/base/components/base-input.component';
import { BaseControlledInputPassword } from '#/base/components/base-input-password.component';
import { defaultValues, schema } from '../helpers/auth-sign-in-schema.helper';
import { UserRole } from '../models/user.model';
import { useAuth } from '../hooks/use-auth.hook';

import type { ComponentProps } from 'react';
import type { AuthCredentials } from '../models/auth.model';

const USER_REGISTER_TO = `/${routeConfig.user.to}/${routeConfig.user.createTo}`;

export const AuthSignInFormCompact = memo(function ({
  className,
  ...moreProps
}: ComponentProps<'form'>) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { signIn } = useAuth();
  const [isDone, setIsDone] = useState(false);

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    getValues,
    reset,
  } = useForm<AuthCredentials>({
    shouldFocusError: false,
    defaultValues,
    resolver: zodResolver(schema),
  });

  const handleRegisterClick = useCallback(() => {
    pathname !== USER_REGISTER_TO && navigate(USER_REGISTER_TO);
  }, [pathname, navigate]);

  const submitForm = useCallback(
    async (data: AuthCredentials) => {
      try {
        const user = await signIn(data);
        const baseTo =
          user.role === UserRole.Member
            ? `/${baseMemberRoute}`
            : `/${baseIssuerRoute}`;
        // Set is done and navigate to user role's dashboard
        setIsDone(true);
        navigate(`${baseTo}/${routeConfig.franchise.to}`);
      } catch (error: any) {
        const email = getValues('email');
        reset({ email, password: '' });
        // Show error and navigate to sign-in page
        toast.error(error.message);
        navigate(`/${routeConfig.authSignIn.to}`, { state: { email } });
      }
    },
    [signIn, reset, getValues, navigate],
  );

  return (
    <form
      className={cx('flex items-center gap-2.5', className)}
      onSubmit={handleSubmit(submitForm)}
      {...moreProps}
    >
      <fieldset
        className='flex items-center gap-2.5'
        disabled={isSubmitting || isDone}
      >
        <BaseControlledInput
          type='email'
          name='email'
          label='Email'
          control={control}
          hideErrorMessage
        />
        <BaseControlledInputPassword
          name='password'
          label='Password'
          control={control}
          hideErrorMessage
        />
      </fieldset>
      <BaseButton
        className='min-w-[100px]'
        type='submit'
        loading={isSubmitting || isDone}
      >
        Sign In
      </BaseButton>
      <BaseButtonIcon
        iconName='user-circle-plus'
        disabled={isSubmitting || isDone}
        onClick={handleRegisterClick}
      />
    </form>
  );
});
