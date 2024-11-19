import { memo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import cx from 'classix';

import { BaseButton } from '#/base/components/base-button.component';
import { BaseControlledInput } from '#/base/components/base-input.component';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'form'> & {
  loading?: boolean;
};

type FormData = {
  mvPlateNo: string;
};

const INVALID_MESSAGE = 'Invalid Plate Number';

const schema = z.object({
  mvPlateNo: z.union([
    z.string().min(3, INVALID_MESSAGE).max(7, INVALID_MESSAGE),
    z.string().length(15, INVALID_MESSAGE),
  ]),
});

const defaultValues = {
  mvPlateNo: '',
};

export const FranchiseCheckerForm = memo(function ({
  className,
  loading,
  ...moreProps
}: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    control,
    formState: { isSubmitting },
    setValue,
    handleSubmit,
  } = useForm<FormData>({
    shouldFocusError: false,
    defaultValues,
    resolver: zodResolver(schema),
  });

  const submitForm = useCallback(
    (data: FormData) => {
      const mvPlateNo = data.mvPlateNo.toLowerCase();
      setSearchParams({ check: mvPlateNo });
    },
    [setSearchParams],
  );

  useEffect(() => {
    const mvPlateNo = searchParams.get('check');

    if (!mvPlateNo?.length) return;

    setValue('mvPlateNo', mvPlateNo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form
      className={cx('flex flex-col gap-2.5', className)}
      onSubmit={handleSubmit(submitForm)}
      {...moreProps}
    >
      <span className='text-lg'>Plate Number</span>
      <div className='flex h-auto flex-col items-start justify-between gap-4 sm:h-[67px] sm:flex-row'>
        <div className='w-full flex-1'>
          <BaseControlledInput
            className='text-lg placeholder:text-base'
            name='mvPlateNo'
            placeholder='TX1234'
            control={control}
            disabled={loading || isSubmitting}
            fullWidth
          />
        </div>
        <BaseButton
          className='w-full min-w-60 !text-base sm:w-auto'
          variant='accent'
          type='submit'
          loading={loading || isSubmitting}
        >
          Check
        </BaseButton>
      </div>
    </form>
  );
});
