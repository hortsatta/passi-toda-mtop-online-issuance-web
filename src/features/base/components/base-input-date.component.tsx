import { memo, forwardRef, useCallback, useRef, useMemo } from 'react';
import { useController } from 'react-hook-form';
import mergeRefs from 'merge-refs';

import dayjs from '#/config/dayjs.config';
import { BaseButtonSimple } from './base-button-simple.component';
import { BaseInput } from './base-input.component';

import type { ChangeEvent, ComponentProps } from 'react';
import type { UseControllerProps } from 'react-hook-form';

export const BaseInputDate = memo(
  forwardRef<HTMLInputElement, ComponentProps<typeof BaseInput>>(
    function (props, ref) {
      const localRef = useRef<HTMLInputElement>(null);

      const handlePickerClick = useCallback(() => {
        localRef.current?.showPicker();
      }, []);

      return (
        <BaseInput
          ref={mergeRefs(ref, localRef)}
          type='date'
          withValue
          {...props}
        >
          <BaseButtonSimple
            className='absolute right-3 opacity-70 hover:opacity-100'
            type='button'
            tabIndex={-1}
            iconName='calendar'
            iconSize={20}
            onClick={handlePickerClick}
          />
        </BaseInput>
      );
    },
  ),
);

export function BaseControlledInputDate(
  props: ComponentProps<typeof BaseInput> & UseControllerProps<any>,
) {
  const {
    field: { value, onChange, ...moreField },
    fieldState: { error },
  } = useController(props);

  const targetValue = useMemo(
    () => (value == null ? '' : dayjs(value).format('YYYY-MM-DD')),
    [value],
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const date = dayjs(event.target.value).toDate();
      onChange(date);
    },
    [onChange],
  );

  return (
    <BaseInputDate
      {...props}
      {...moreField}
      value={targetValue}
      errorMessage={error?.message}
      onChange={handleChange}
    />
  );
}
