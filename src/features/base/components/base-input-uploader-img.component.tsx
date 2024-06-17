import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useController } from 'react-hook-form';
import mergeRefs from 'merge-refs';
import cx from 'classix';

import { BaseButtonSimple } from './base-button-simple.component';
import { BaseIcon } from './base-icon.component';

import type { ChangeEvent, ComponentProps, MouseEvent } from 'react';
import type { UseControllerProps } from 'react-hook-form';

type Props = Omit<ComponentProps<'input'>, 'onChange' | 'value'> & {
  value?: File | string | null;
  label?: string;
  description?: string;
  errorMessage?: string;
  fullWidth?: boolean;
  lg?: boolean;
  asterisk?: boolean;
  hideErrorMessage?: boolean;
  withValue?: boolean;
  wrapperProps?: ComponentProps<'div'>;
  onChange?: (file: any) => void;
};

export const BaseInputUploaderImg = memo(
  forwardRef<HTMLInputElement, Props>(function (
    {
      className,
      id,
      name,
      value,
      label,
      description,
      errorMessage,
      fullWidth,
      lg,
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
    const localRef = useRef<HTMLInputElement>(null);
    const [localValue, setLocalValue] = useState(value);
    const [currentImage, setCurrentImage] = useState<
      string | ArrayBuffer | null
    >(null);

    const labelText = useMemo(() => {
      let text = 'Select image';

      if (label?.trim()) {
        text = label;
      }

      return asterisk || required ? `${text}*` : text;
    }, [label, asterisk, required]);

    const handleChange = useCallback(
      async (event: ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        const file = !files?.length ? null : files[0];

        setLocalValue(file);
        onChange && onChange(file);
      },
      [onChange],
    );

    const handleRemove = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();

        // Clear value cache bug
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value',
        )?.set;
        nativeInputValueSetter?.call(localRef.current, null);
        const ev2 = new Event('input', { bubbles: true });
        localRef.current?.dispatchEvent(ev2);

        setLocalValue(null);
        onChange && onChange(null);
      },
      [onChange],
    );

    const handleClick = useCallback(() => {
      localRef.current?.click();
    }, []);

    useEffect(() => {
      if (!value && !localValue) {
        setCurrentImage(null);
        return;
      }

      const target = value ?? localValue;

      if (target instanceof File) {
        const reader = new FileReader();
        reader.readAsDataURL(target as any);
        reader.onload = () => {
          setCurrentImage(reader.result);
        };
      } else {
        setCurrentImage(target || null);
      }
    }, [value, localValue]);

    return (
      <div
        className={cx(
          'relative flex w-full cursor-pointer items-center justify-center rounded border border-border bg-backdrop-input',
          !value && !localValue ? 'h-14' : 'h-60',
          lg && 'min-h-36',
          !fullWidth && 'max-w-52',
          (!!description?.trim() ||
            (!!errorMessage?.trim() && !hideErrorMessage)) &&
            'mb-5',
          !!errorMessage?.trim() && '!border-red-500',
          !disabled && 'hover:bg-backdrop-input-hover',
          wrapperClassName,
        )}
        onClick={handleClick}
        {...moreWrapperProps}
      >
        {!currentImage ? (
          <div
            className={cx(
              'relative flex h-full w-full items-center px-4',
              lg ? 'flex-col justify-center gap-4' : 'flex-row justify-between',
            )}
          >
            <span className={cx('text-text/60', lg && 'order-last')}>
              {labelText}
            </span>
            <div className='opacity-70 hover:opacity-100'>
              <BaseIcon name='image' size={lg ? 30 : 20} />
            </div>
          </div>
        ) : (
          <div className='relative flex h-full w-full items-center justify-center'>
            <BaseButtonSimple
              type='button'
              className='absolute right-2.5 top-2.5'
              iconName='x'
              onClick={handleRemove}
            />
            <img
              src={currentImage.toString()}
              className='h-full w-full object-contain'
              alt='image upload'
            />
          </div>
        )}
        <input
          ref={mergeRefs(ref, localRef)}
          name={name}
          type='file'
          id={newId}
          className={cx('absolute hidden h-0 w-0', className)}
          accept='image/*'
          required={required}
          disabled={disabled}
          onChange={handleChange}
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

export function BaseControlledInputUploaderImage(
  props: Props & UseControllerProps<any>,
) {
  const {
    field: { onChange, ...moreField },
    fieldState: { error },
  } = useController(props);

  const handleChange = useCallback(
    (value: any) => {
      if (!(value instanceof File)) {
        onChange(value);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(value as any);
      reader.onload = () => {
        onChange(reader.result);
      };
    },
    [onChange],
  );

  return (
    <BaseInputUploaderImg
      {...props}
      onChange={handleChange}
      {...moreField}
      errorMessage={error?.message}
    />
  );
}
