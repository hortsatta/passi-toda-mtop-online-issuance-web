import { memo, forwardRef, useState, useCallback, useMemo } from 'react';
import { useController } from 'react-hook-form';

import { BaseButtonSimple } from './base-button-simple.component';
import { BaseInput } from './base-input.component';

import type { ComponentProps } from 'react';
import type { UseControllerProps } from 'react-hook-form';

type Props = ComponentProps<typeof BaseInput> & {
  showPassword?: boolean;
  setShowPassword?: (showPassword: boolean) => void;
};

export const BaseInputPassword = memo(
  forwardRef<HTMLInputElement, Props>(function (
    { showPassword, setShowPassword, ...moreProps },
    ref,
  ) {
    const [localShowPassword, setLocalShowPassword] = useState(!!showPassword);

    const finalShowPassword = useMemo(
      () => (showPassword == null ? localShowPassword : showPassword),
      [showPassword, localShowPassword],
    );

    const handlePasswordClick = useCallback(() => {
      setLocalShowPassword(!finalShowPassword);
      setShowPassword && setShowPassword(!finalShowPassword);
    }, [finalShowPassword, setShowPassword]);

    return (
      <BaseInput
        ref={ref}
        type={finalShowPassword ? 'text' : 'password'}
        className='!pr-11'
        {...moreProps}
      >
        <BaseButtonSimple
          className='absolute right-3 opacity-70 hover:opacity-100'
          type='button'
          tabIndex={-1}
          iconName={!finalShowPassword ? 'eye-slash' : 'eye'}
          iconSize={20}
          onClick={handlePasswordClick}
        />
      </BaseInput>
    );
  }),
);

export function BaseControlledInputPassword(
  props: Props & UseControllerProps<any>,
) {
  const {
    field,
    fieldState: { error },
  } = useController(props);

  return (
    <BaseInputPassword {...props} {...field} errorMessage={error?.message} />
  );
}
