import { memo, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import isMobilePhone from 'validator/lib/isMobilePhone';
import { z } from 'zod';
import toast from 'react-hot-toast';
import cx from 'classix';

import { genderSelectOptions } from '#/user/helpers/user-helper';
import { BaseButtonIcon } from '#/base/components/base-button-icon.component';
import { BaseButton } from '#/base/components/base-button.component';
import { BaseControlledInput } from '#/base/components/base-input.component';
import { BaseControlledInputPassword } from '#/base/components/base-input-password.component';
import { BaseControlledInputDate } from '#/base/components/base-input-date.component';
import { BaseControlledInputSelect } from '#/base/components/base-input-select.component';
import { UserRole } from '../models/user.model';
import { UserGender } from '../models/user.model';

import type { FormProps } from '#/base/models/base.model';
import type { User } from '../models/user.model';
import type { UserCreateFormData } from '../models/user-form-data.model';

type Props = Omit<
  FormProps<'div', UserCreateFormData, Promise<User | null>>,
  'onSubmit'
> & {
  userRole: UserRole;
  onSubmit: (data: UserCreateFormData, role: UserRole) => Promise<User | null>;
};

const schema = z
  .object({
    email: z.string().email('Provide your email address'),
    password: z
      .string()
      .min(8, 'Password should be minimum of 8 characters')
      .max(100, 'Password is too long'),
    confirmPassword: z.string(),
    firstName: z
      .string()
      .min(2, 'Name is too short')
      .max(50, 'Name is too long'),
    lastName: z
      .string()
      .min(2, 'Name is too short')
      .max(50, 'Name is too long'),
    middleName: z
      .string()
      .min(1, 'Name is too short')
      .max(50, 'Name is too long')
      .optional(),
    birthDate: z
      .date({ required_error: 'Provide your date of birth' })
      .min(new Date('1900-01-01'), 'Date of birth is too old')
      .max(new Date(), 'Date of birth is too young'),
    phoneNumber: z
      .string()
      .refine((value) => isMobilePhone(value.replace(/[^0-9]/g, ''), 'en-PH'), {
        message: 'Phone number is invalid',
      }),
    gender: z.nativeEnum(UserGender, {
      required_error: 'Provide your gender',
    }),
    driverLicenseNo: z
      .string()
      .length(11, `Invalid driver's license`)
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password does not match',
    path: ['confirmPassword'],
  });

const defaultValues: Partial<UserCreateFormData> = {
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  middleName: '',
  birthDate: undefined,
  phoneNumber: '',
  gender: undefined,
  driverLicenseNo: '',
};

export const UserCreateForm = memo(function ({
  className,
  loading: formLoading,
  userRole,
  isDone,
  onDone,
  onSubmit,
  ...moreProps
}: Props) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = useForm<UserCreateFormData>({
    shouldFocusError: false,
    defaultValues,
    resolver: zodResolver(schema),
  });

  const loading = useMemo(
    () => formLoading || isSubmitting || isDone,
    [formLoading, isSubmitting, isDone],
  );

  const handleReset = useCallback(() => reset(), [reset]);

  const submitForm = useCallback(
    async (data: UserCreateFormData) => {
      try {
        await onSubmit(data, userRole);
        toast.success('You have successfully registered!');
        onDone && onDone(true);
        navigate('/');
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [userRole, navigate, onSubmit, onDone],
  );

  return (
    <div
      className={cx(
        'w-full rounded bg-backdrop-surface px-16 py-12',
        className,
      )}
      {...moreProps}
    >
      <form
        className='flex flex-col gap-10'
        onSubmit={handleSubmit(submitForm)}
      >
        <fieldset className='flex flex-col gap-6' disabled={loading}>
          <div className='flex flex-col gap-4'>
            <h4>Credentials</h4>
            <div className='flex gap-2.5'>
              <BaseControlledInput
                type='email'
                name='email'
                label='Email'
                control={control}
                fullWidth
                asterisk
              />
              <BaseControlledInputPassword
                name='password'
                label='Password'
                control={control}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                fullWidth
                asterisk
              />
              <BaseControlledInputPassword
                name='confirmPassword'
                label='Confirm Password'
                control={control}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                fullWidth
                asterisk
              />
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            <h4>Personal Info</h4>
            <div className='grid grid-cols-3 gap-2.5'>
              <BaseControlledInput
                name='firstName'
                label='First Name'
                control={control}
                fullWidth
                asterisk
              />
              <BaseControlledInput
                name='lastName'
                label='Last Name'
                control={control}
                fullWidth
                asterisk
              />
              <BaseControlledInput
                name='middleName'
                label='Middle Name'
                control={control}
                fullWidth
              />
              <BaseControlledInputDate
                type='date'
                name='birthDate'
                label='Date of Birth'
                control={control}
                fullWidth
                asterisk
              />
              <BaseControlledInputSelect
                name='gender'
                label='Gender'
                items={genderSelectOptions}
                control={control}
                fullWidth
              />
              <BaseControlledInput
                name='phoneNumber'
                label='Phone'
                control={control}
                fullWidth
                asterisk
              />
              <BaseControlledInput
                name='driverLicenseNo'
                label={`Driver's License No`}
                control={control}
                fullWidth
                asterisk
              />
            </div>
          </div>
        </fieldset>
        <div className='w-full border-b border-border' />
        <div className='flex w-full items-center justify-between'>
          <BaseButtonIcon
            iconName='arrow-counter-clockwise'
            loading={loading}
            disabled={isDone}
            onClick={handleReset}
          />
          <BaseButton
            className='min-w-[200px] px-10 !text-base'
            type='submit'
            loading={loading}
            disabled={isDone}
          >
            Register
          </BaseButton>
        </div>
      </form>
    </div>
  );
});
