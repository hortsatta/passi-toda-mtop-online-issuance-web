import { forwardRef, memo, useMemo, useRef } from 'react';
import { useController } from 'react-hook-form';
import mergeRefs from 'merge-refs';
import cx from 'classix';

import type { ComponentProps, ReactNode } from 'react';
import type { UseControllerProps } from 'react-hook-form';

type Props = ComponentProps<'textarea'> & {
  description?: string;
  errorMessage?: string;
  fullWidth?: boolean;
  asterisk?: boolean;
  hideErrorMessage?: boolean;
  withValue?: boolean;
  children?: ReactNode;
  wrapperProps?: ComponentProps<'div'>;
};

type ControlledProps = Props & UseControllerProps<any>;

export const BaseTextarea = memo(
  forwardRef<HTMLTextAreaElement, Props>(function (
    {
      className,
      id,
      name,
      value,
      placeholder = '',
      description,
      errorMessage,
      fullWidth,
      asterisk,
      hideErrorMessage,
      required,
      disabled,
      wrapperProps: { className: wrapperClassName, ...moreWrapperProps } = {},
      ...moreProps
    },
    ref,
  ) {
    const newId = id || name;
    const localRef = useRef<HTMLTextAreaElement>(null);

    const placeholderText = useMemo(
      () => (asterisk || required ? `${placeholder}*` : placeholder),
      [placeholder, asterisk, required],
    );

    return (
      <div
        className={cx(
          'relative flex min-h-24 w-full rounded bg-backdrop-input',
          !fullWidth && 'max-w-52',
          (!!description?.trim() ||
            (!!errorMessage?.trim() && !hideErrorMessage)) &&
            'mb-5',
          !disabled && 'hover:bg-backdrop-input-hover',
          wrapperClassName,
        )}
        {...moreWrapperProps}
      >
        <textarea
          ref={mergeRefs(ref, localRef)}
          name={name}
          id={newId}
          className={cx(
            'inline-block h-full min-h-24 w-full flex-1 overflow-hidden rounded border border-border bg-transparent px-4 py-2.5 text-text !outline-none focus:border-primary',
            !!errorMessage?.trim() && '!border-red-500',
            disabled && 'opacity-50',
            className,
          )}
          value={value}
          placeholder={placeholderText}
          required={required}
          disabled={disabled}
          {...moreProps}
        />
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

export function BaseControlledTextarea(props: ControlledProps) {
  const {
    field: { value, ...moreFields },
    fieldState: { error },
  } = useController(props);

  return (
    <BaseTextarea
      {...props}
      {...moreFields}
      value={value || ''}
      errorMessage={error?.message}
    />
  );
}
