import { memo, useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import cx from 'classix';
import toast from 'react-hot-toast';

import { routeConfig } from '#/config/routes.config';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseButton } from '#/base/components/base-button.component';
import { BaseControlledInputPassword } from '#/base/components/base-input-password.component';

import type { FormProps } from '#/base/models/base.model';

type Props = FormProps<'form', string, Promise<void>>;

type FormData = {
  password: string;
  confirmPassword: string;
};

const USER_SIGN_IN = `/${routeConfig.auth.signIn.to}`;

const schema = z
  .object({
    password: z
      .string()
      .min(8, 'Password should be minimum of 8 characters')
      .max(100, 'Password is too long'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password does not match',
    path: ['confirmPassword'],
  });

const defaultValues: Partial<FormData> = {
  password: '',
  confirmPassword: '',
};

export const UserPasswordResetForm = memo(function ({
  className,
  loading: formLoading,
  isDone,
  onSubmit,
  ...moreProps
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<FormData>({
    shouldFocusError: false,
    defaultValues,
    resolver: zodResolver(schema),
  });

  const loading = useMemo(
    () => formLoading || isSubmitting,
    [formLoading, isSubmitting],
  );

  const submitForm = useCallback(
    async (data: FormData) => {
      try {
        await (onSubmit && onSubmit(data.password));
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [onSubmit],
  );

  return (
    <form
      className={cx(
        'flex w-full flex-col items-center gap-5 rounded bg-backdrop-surface px-4 py-5 lg:px-16 lg:py-12',
        className,
      )}
      onSubmit={handleSubmit(submitForm)}
      {...moreProps}
    >
      {!isDone ? (
        <>
          <fieldset
            className='flex w-full flex-col items-center gap-5'
            disabled={loading || isDone}
          >
            <BaseControlledInputPassword
              name='password'
              label='New Password'
              control={control}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              fullWidth
              asterisk
            />
            <BaseControlledInputPassword
              name='confirmPassword'
              label='Confirm New Password'
              control={control}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              fullWidth
              asterisk
            />
          </fieldset>
          <BaseButton
            className='w-full'
            type='submit'
            loading={loading}
            disabled={isDone}
          >
            Update Password
          </BaseButton>
        </>
      ) : (
        <>
          <div className='flex w-full items-center justify-center gap-2.5 py-2.5'>
            <BaseIcon
              name='check-circle'
              size={46}
              className='text-green-500'
            />
            <div>
              <h4>Password has been updated</h4>
              <span>Please sign-in using your new password.</span>
            </div>
          </div>
          <Link to={USER_SIGN_IN}>Proceed to sign-in</Link>
        </>
      )}
    </form>
  );
});
