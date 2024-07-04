import { memo, useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import cx from 'classix';

import { routeConfig } from '#/config/routes.config';
import { BaseButton } from '#/base/components/base-button.component';
import { BaseControlledInput } from '#/base/components/base-input.component';
import { BaseControlledInputPassword } from '#/base/components/base-input-password.component';
import { defaultValues, schema } from '../helpers/auth-sign-in-schema.helper';

import type { FormProps } from '#/base/models/base.model';
import type { AuthCredentials } from '../models/auth.model';

type Props = FormProps<'form', AuthCredentials, Promise<void>> & {
  email?: string;
};

const USER_REGISTER_TO = `/${routeConfig.user.to}/${routeConfig.user.create.to}`;

export const AuthSignInForm = memo(function ({
  className,
  email,
  onSubmit,
  ...moreProps
}: Props) {
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
        setIsDone(true);
        await (onSubmit && onSubmit(data));
      } catch (error: any) {
        setIsDone(false);
        reset({ email: getValues('email'), password: '' });
        toast.error(error.message);
      }
    },
    [onSubmit, getValues, reset],
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
      <Link to={USER_REGISTER_TO}>Not yet registered? Sign up</Link>
    </form>
  );
});
