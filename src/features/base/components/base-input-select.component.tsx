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

import type { ChangeEvent, ComponentProps } from 'react';
import type { UseControllerProps } from 'react-hook-form';
import type { IconName, SelectItem } from '../models/base.model';

type Props = ComponentProps<'select'> & {
  items: SelectItem[];
  label?: string;
  description?: string;
  errorMessage?: string;
  iconName?: IconName;
  fullWidth?: boolean;
  asterisk?: boolean;
  hideErrorMessage?: boolean;
  wrapperProps?: ComponentProps<'div'>;
};

export const BaseInputSelect = memo(
  forwardRef<HTMLSelectElement, Props>(function (
    {
      className,
      id,
      name,
      value,
      items,
      label,
      description,
      errorMessage,
      iconName,
      fullWidth,
      asterisk,
      hideErrorMessage,
      required,
      disabled,
      wrapperProps: { className: wrapperClassName, ...moreWrapperProps } = {},
      onChange,
      ...moreProps
    },
    ref,
  ) {
    const newId = id || name;
    const localRef = useRef<HTMLSelectElement>(null);
    const [localValue, setLocalValue] = useState(value);

    const labelText = useMemo(
      () => (asterisk || required ? `${label}*` : label),
      [label, asterisk, required],
    );

    const hasValue = useMemo(
      () => !!value || !!localValue,
      [value, localValue],
    );

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLSelectElement>) => {
        setLocalValue(event.target.value);
      },
      [],
    );

    const handleFocusClick = useCallback(() => {
      localRef.current?.focus();
    }, [localRef]);

    const handlePickerClick = useCallback(() => {
      localRef.current?.showPicker();
    }, []);

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
        <select
          ref={mergeRefs(ref, localRef)}
          name={name}
          id={newId}
          className={cx(
            'inline-block h-full w-full flex-1 rounded border border-border bg-transparent pr-4 !outline-none focus:border-primary',
            hasValue ? 'text-text' : 'text-text/60',
            iconName ? 'pl-11' : 'pl-4',
            !!errorMessage?.trim() && '!border-red-500',
            disabled && 'opacity-50',
            className,
          )}
          value={value || localValue || 0}
          required={required}
          disabled={disabled}
          onChange={onChange || handleChange}
          {...moreProps}
        >
          {!!label?.trim() && (
            <option value={0} disabled>
              {labelText}
            </option>
          )}
          {items.map(({ value, label }) => (
            <option key={value} className='text-black' value={value}>
              {label || value}
            </option>
          ))}
        </select>
        <button
          className='absolute right-3 opacity-70 hover:opacity-100'
          type='button'
          tabIndex={-1}
          onClick={handlePickerClick}
        >
          <BaseIcon name='caret-circle-down' size={20} />
        </button>
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

export function BaseControlledInputSelect({
  isNumber,
  ...moreProps
}: Props & UseControllerProps<any> & { isNumber?: boolean }) {
  const {
    field: { onChange, ...moreField },
    fieldState: { error },
  } = useController(moreProps);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const transformedValue = event.target.value?.trim()
        ? +event.target.value
        : '';
      onChange(transformedValue);
    },
    [onChange],
  );

  return (
    <BaseInputSelect
      {...moreProps}
      {...moreField}
      onChange={isNumber ? handleChange : onChange}
      errorMessage={error?.message}
    />
  );
}
