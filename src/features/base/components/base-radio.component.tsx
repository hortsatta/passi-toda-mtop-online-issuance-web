import { forwardRef, memo, useCallback } from 'react';
import { Radio, RadioGroup } from '@headlessui/react';
import cx from 'classix';

import { BaseIcon } from './base-icon.component';

import type { ComponentProps, ReactNode } from 'react';
import type { QueryFilterOption } from '#/core/models/core.model';

type Props = ComponentProps<typeof RadioGroup> & {
  options: QueryFilterOption[];
};

type RadioProps = ComponentProps<typeof Radio> & {
  checked?: boolean;
};

export const BaseRadio = memo(
  forwardRef<HTMLElement, RadioProps>(function (
    { className, checked, children, ...moreProps },
    ref,
  ) {
    return (
      <Radio
        ref={ref}
        className={cx(
          'flex cursor-pointer items-center gap-2 text-base transition-colors hover:text-primary',
          className,
        )}
        {...moreProps}
      >
        <div className='inline-block'>
          <BaseIcon name={checked ? 'check-circle' : 'circle'} size={20} />
        </div>
        {children as ReactNode}
      </Radio>
    );
  }),
);

export const BaseRadioGroup = memo(function ({
  className,
  value,
  options,
  ...moreProps
}: Props) {
  const isChecked = useCallback(
    (option: QueryFilterOption) => option.key === (value as any).key,
    [value],
  );

  return (
    <RadioGroup
      className={cx('flex flex-col gap-2.5', className)}
      value={value}
      {...moreProps}
    >
      {options.map((option) => (
        <BaseRadio key={option.key} value={option} checked={isChecked(option)}>
          {option.label}
        </BaseRadio>
      ))}
    </RadioGroup>
  );
});
