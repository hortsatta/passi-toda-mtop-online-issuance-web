import { forwardRef, memo, useCallback, useState } from 'react';
import { Checkbox } from '@headlessui/react';
import cx from 'classix';

import { BaseIcon } from './base-icon.component';

import type { ComponentProps, ReactNode } from 'react';

type Props = Omit<ComponentProps<typeof Checkbox>, 'children'> & {
  checked?: boolean;
  children?: ReactNode;
};

export const BaseCheckbox = memo(
  forwardRef<HTMLSpanElement, Props>(function (
    { className, checked, children, onChange, ...moreProps },
    ref,
  ) {
    const [localChecked, setLocalChecked] = useState(checked ?? false);

    const handleChange = useCallback(
      (checked: boolean) => {
        setLocalChecked(checked);
        onChange && onChange(checked);
      },
      [onChange],
    );

    return (
      <Checkbox
        ref={ref}
        className={cx(
          'flex cursor-pointer items-center gap-2 text-base transition-colors hover:text-primary',
          className,
        )}
        checked={checked ?? localChecked}
        onChange={handleChange}
        {...moreProps}
      >
        <BaseIcon
          name={checked ?? localChecked ? 'check-square' : 'square'}
          size={20}
        />
        {children}
      </Checkbox>
    );
  }),
);
