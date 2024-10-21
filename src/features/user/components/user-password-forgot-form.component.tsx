import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import cx from 'classix';

import { routeConfig } from '#/config/routes.config';
import { BaseControlledInput } from '#/base/components/base-input.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseButton } from '#/base/components/base-button.component';

import type { FormProps } from '#/base/models/base.model';

type Props = FormProps<'form', string, Promise<void>> & {
  isEmailSent: boolean;
};

type FormData = {
  email: string;
};

const USER_SIGN_IN = `/${routeConfig.auth.signIn.to}`;

const schema = z.object({
  email: z.string().email('Provide your email address'),
});

const defaultValues = {
  email: '',
};

export const UserPasswordForgotForm = memo(function ({
  className,
  loading,
  isEmailSent,
  onSubmit,
  ...moreProps
}: Props) {
  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<FormData>({
    shouldFocusError: false,
    defaultValues,
    resolver: zodResolver(schema),
  });

  const submitForm = useCallback(
    async (data: { email: string }) => {
      try {
        await (onSubmit && onSubmit(data.email));
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [onSubmit],
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
        disabled={isSubmitting || isEmailSent || loading}
      >
        <BaseControlledInput
          type='email'
          name='email'
          label='Email'
          control={control}
          hideErrorMessage
          fullWidth
        />
      </fieldset>
      {!isEmailSent ? (
        <BaseButton
          className='w-full'
          type='submit'
          loading={isSubmitting || loading}
        >
          Request Password Reset
        </BaseButton>
      ) : (
        <div className='flex w-full items-center gap-2.5 bg-backdrop-surface py-2.5'>
          <BaseIcon name='check-circle' size={46} className='text-green-500' />
          <div>
            <h4>Password reset email sent</h4>
            <span>Please check your inbox to find your reset link.</span>
          </div>
        </div>
      )}
      <Link to={USER_SIGN_IN}>Back to sign-in</Link>
    </form>
  );
});
