import { memo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import cx from 'classix';

import { routeConfig } from '#/config/routes.config';
import { BaseControlledInput } from '#/base/components/base-input.component';
import { BaseButton } from '#/base/components/base-button.component';

import type { ComponentProps } from 'react';

type FormData = {
  mvPlateNo: string;
};

const FRANCHISE_CREATE_TO = `/${routeConfig.franchise.to}/${routeConfig.franchise.createTo}`;

const schema = z.object({
  mvPlateNo: z.string().min(3, 'MV File Number or Plate Number is too short'),
});

const defaultValues = {
  mvPlateNo: '',
};

export const FranchiseCheckerForm = memo(function ({
  className,
  ...moreProps
}: ComponentProps<'form'>) {
  const navigate = useNavigate();
  const [isDone, setIsDone] = useState(false);

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
    (data: FormData) => {
      const query = `?mvpn=${data.mvPlateNo.toLowerCase()}&check=true`;
      const to = `${FRANCHISE_CREATE_TO}${query}`;
      setIsDone(true);

      setTimeout(() => {
        navigate(to);
      }, 1200);
    },
    [navigate],
  );

  return (
    <form
      className={cx(
        'flex flex-1 flex-col overflow-hidden rounded-lg bg-backdrop-surface-accent',
        className,
      )}
      onSubmit={handleSubmit(submitForm)}
      {...moreProps}
    >
      <div className='flex flex-1 flex-col gap-8 px-12 py-8 pt-14'>
        <p className='max-w-96 text-xl'>
          Enter your{' '}
          <span className='font-bold'>Motor Vehicle (MV) File Number</span> or{' '}
          <span className='font-bold'>Plate Number</span>.
        </p>
        <div className='w-full max-w-44 border-b border-b-backdrop-input-primary opacity-40' />
        <BaseControlledInput
          className='!h-16 !bg-backdrop-input-primary text-lg placeholder:text-base placeholder:text-text/60 hover:!border-text/60 focus:!border-text'
          name='mvPlateNo'
          placeholder='MV1234567890123 or TX1234'
          control={control}
          disabled={isSubmitting || isDone}
          fullWidth
        />
      </div>
      <BaseButton
        className='h-[80px] w-full rounded-none border-none !bg-accent !text-xl hover:!bg-yellow-700 active:!bg-accent'
        type='submit'
        loading={isSubmitting || isDone}
      >
        Proceed
      </BaseButton>
    </form>
  );
});
