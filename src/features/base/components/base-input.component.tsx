import {
  forwardRef,
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useController } from 'react-hook-form';
import mergeRefs from 'merge-refs';
import cx from 'classix';

import { BaseIcon } from './base-icon.component';

import type { ChangeEvent, ComponentProps, ReactNode } from 'react';
import type { UseControllerProps } from 'react-hook-form';
import type { IconName } from '../models/base.model';

type Props = ComponentProps<'input'> & {
  label?: string;
  description?: string;
  errorMessage?: string;
  iconName?: IconName;
  fullWidth?: boolean;
  asterisk?: boolean;
  hideErrorMessage?: boolean;
  withValue?: boolean;
  children?: ReactNode;
  wrapperProps?: ComponentProps<'div'>;
};

type ControlledProps = Props & UseControllerProps<any>;

export const BaseInput = memo(
  forwardRef<HTMLInputElement, Props>(function (
    {
      className,
      id,
      name,
      value,
      placeholder = '',
      label,
      description,
      errorMessage,
      iconName,
      fullWidth,
      asterisk,
      hideErrorMessage,
      withValue,
      required,
      disabled,
      children,
      wrapperProps: { className: wrapperClassName, ...moreWrapperProps } = {},
      onChange,
      ...moreProps
    },
    ref,
  ) {
    const newId = id || name;
    const localRef = useRef<HTMLInputElement>(null);
    const [localValue, setLocalValue] = useState(value);

    const labelText = useMemo(
      () => (asterisk || required ? `${label}*` : label),
      [label, asterisk, required],
    );

    const hasValue = useMemo(
      () => !!value || !!localValue || withValue,
      [value, localValue, withValue],
    );

    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
      setLocalValue(event.target.value);
    }, []);

    const handleFocusClick = useCallback(() => {
      localRef.current?.focus();
    }, [localRef]);

    return (
      <div
        className={cx(
          'relative flex h-14 w-full items-center justify-center rounded bg-backdrop-input',
          !fullWidth && 'max-w-52',
          (!!description?.trim() ||
            (!!errorMessage?.trim() && !hideErrorMessage)) &&
            'mb-5',
          !disabled && 'hover:bg-backdrop-input-hover',
          wrapperClassName,
        )}
        {...moreWrapperProps}
      >
        <input
          ref={mergeRefs(ref, localRef)}
          name={name}
          type='text'
          id={newId}
          className={cx(
            'inline-block h-full w-full flex-1 overflow-hidden rounded border border-border bg-transparent pr-4 text-text !outline-none focus:border-primary',
            hasValue && !!label?.trim() ? 'pt-2.5' : 'pt-0',
            iconName ? 'pl-11' : 'pl-4',
            !!errorMessage?.trim() && '!border-red-500',
            disabled && 'opacity-50',
            className,
          )}
          value={value}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          onChange={onChange || handleChange}
          {...moreProps}
        />
        {children}
        {iconName && (
          <div
            className={cx(
              'absolute left-3',
              !disabled ? 'cursor-text opacity-80' : 'opacity-50',
            )}
            onClick={handleFocusClick}
          >
            <BaseIcon name={iconName} size={24} />
          </div>
        )}
        {!!label?.trim() && (
          <label
            htmlFor={newId}
            className={cx(
              'absolute top-1/2 -translate-y-1/2 text-text/60',
              hasValue && '-ml-0.5 -mt-2.5 text-xs',
              iconName ? 'left-12' : 'left-5',
              !disabled ? 'cursor-text' : 'opacity-50',
            )}
            {...(!newId && { onClick: handleFocusClick })}
          >
            {labelText}
          </label>
        )}
        {!!description?.trim() &&
          (!errorMessage?.trim() || hideErrorMessage) && (
            <small className='absolute -bottom-6 left-2 text-sm text-text/60'>
              {description}
            </small>
          )}
        {!!errorMessage?.trim() && !hideErrorMessage && (
          <small className='absolute -bottom-6 left-2 text-sm text-red-600'>
            {errorMessage}
          </small>
        )}
      </div>
    );
  }),
);

export function BaseControlledInput(props: ControlledProps) {
  const {
    field: { value, ...moreFields },
    fieldState: { error },
  } = useController(props);

  return (
    <BaseInput
      {...props}
      {...moreFields}
      value={value || ''}
      errorMessage={error?.message}
    />
  );
}
