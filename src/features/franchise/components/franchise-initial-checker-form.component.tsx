import { memo, useCallback, useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
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

const FRANCHISE_CHECKER_TO = `/${routeConfig.franchiseChecker.to}`;
const INVALID_MESSAGE = 'Invalid MV File Number or Plate Number';

const schema = z.object({
  mvPlateNo: z.union([
    z.string().min(3, INVALID_MESSAGE).max(7, INVALID_MESSAGE),
    z.string().length(15, INVALID_MESSAGE),
  ]),
});

const defaultValues = {
  mvPlateNo: '',
};

export const FranchiseInitialCheckerForm = memo(function ({
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
      const searchParams = createSearchParams({
        check: data.mvPlateNo.toLowerCase(),
      }).toString();

      setIsDone(true);
      setTimeout(() => {
        navigate({ pathname: FRANCHISE_CHECKER_TO, search: searchParams });
      }, 600);
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
        <div className='border-b-backdrop-input-accent w-full max-w-44 border-b opacity-40' />
        <BaseControlledInput
          className='!bg-backdrop-input-accent !h-16 text-lg placeholder:text-base placeholder:text-text/60 hover:!border-text/60 focus:!border-text'
          name='mvPlateNo'
          placeholder='MV1234567890123 or TX1234'
          control={control}
          disabled={isSubmitting || isDone}
          fullWidth
        />
      </div>
      <BaseButton
        className='h-[80px] w-full rounded-none border-none !text-xl'
        type='submit'
        variant='accent'
        loading={isSubmitting || isDone}
      >
        Proceed
      </BaseButton>
    </form>
  );
});
