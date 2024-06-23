import cx from 'classix';
import { memo } from 'react';

import type { ComponentProps } from 'react';
import isURL from 'validator/lib/isURL';
import { BaseIcon } from './base-icon.component';

type Props = ComponentProps<'img'> & {
  label?: string;
  wrapperProps?: ComponentProps<'div'>;
};

export const BaseFieldImg = memo(function ({
  className,
  label,
  src,
  onClick,
  wrapperProps: { className: wrapperClassName, ...moreWrapperProps } = {},
  ...moreProps
}: Props) {
  return (
    <div
      className={cx(
        'flex h-fit flex-1 flex-col gap-2.5 rounded bg-backdrop-input p-4',
        wrapperClassName,
      )}
      {...moreWrapperProps}
    >
      <div className='inline-block h-60 overflow-hidden rounded bg-backdrop-surface'>
        {isURL(src || '') ? (
          <img
            className={cx(
              'inline-block h-full w-full object-contain',
              onClick && 'cursor-pointer',
              className,
            )}
            src={src}
            alt={label}
            onClick={onClick}
            {...moreProps}
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center opacity-30'>
            <BaseIcon name='placeholder' size={80} />
          </div>
        )}
      </div>
      {label && (
        <>
          <div className='border-b border-border' />
          <small className='text-xs uppercase leading-tight'>{label}</small>
        </>
      )}
    </div>
  );
});
