import { memo, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { BaseControlledInput } from '#/base/components/base-input.component';
import { BaseControlledInputPassword } from '#/base/components/base-input-password.component';
import { defaultValues, schema } from '../helpers/auth-sign-in-schema.helper';
import { UserRole } from '../models/user.model';
import { useAuth } from '../hooks/use-auth.hook';

import type { ComponentProps } from 'react';
import type { AuthCredentials } from '../models/auth.model';

type Props = ComponentProps<'form'> & {
  email?: string;
};

export const AuthSignInForm = memo(function ({
  className,
  email,
  ...moreProps
}: Props) {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [isDone, setIsDone] = useState(false);

  const transformDefaultValues = useMemo(() => {
    if (!email?.trim()) {
      return defaultValues;
    }

    return { ...defaultValues, email };
  }, [email]);

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    getValues,
    reset,
  } = useForm<AuthCredentials>({
    shouldFocusError: false,
    defaultValues: transformDefaultValues,
    resolver: zodResolver(schema),
  });

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
        reset({ email: getValues('email'), password: '' });
        toast.error(error.message);
      }
    },
    [signIn, reset, getValues, navigate],
  );

  return (
    <form
      className={cx(
        'flex w-full flex-col items-center gap-5 rounded bg-backdrop-surface px-16 py-12',
        className,
      )}
      onSubmit={handleSubmit(submitForm)}
      {...moreProps}
    >
      <fieldset
        className='flex w-full flex-col items-center gap-5'
        disabled={isSubmitting || isDone}
      >
        <BaseControlledInput
          type='email'
          name='email'
          label='Email'
          control={control}
          hideErrorMessage
          fullWidth
        />
        <BaseControlledInputPassword
          name='password'
          label='Password'
          control={control}
          hideErrorMessage
          fullWidth
        />
      </fieldset>
      <BaseButton
        className='w-full'
        type='submit'
        loading={isSubmitting || isDone}
      >
        Sign In
      </BaseButton>
    </form>
  );
});
