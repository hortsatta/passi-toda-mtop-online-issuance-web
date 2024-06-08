import cx from 'classix';
import { memo } from 'react';

import type { ComponentProps } from 'react';
import isURL from 'validator/lib/isURL';

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
  if (!isURL(src || '')) return null;

  return (
    <div
      className={cx(
        'flex h-fit flex-1 flex-col gap-2.5 rounded bg-backdrop-input p-4',
        wrapperClassName,
      )}
      {...moreWrapperProps}
    >
      <img
        className={cx(
          'inline-block h-60 overflow-hidden rounded bg-backdrop-surface object-contain',
          onClick && 'cursor-pointer',
          className,
        )}
        src={src}
        alt={label}
        onClick={onClick}
        {...moreProps}
      />
      {label && (
        <>
          <div className='border-b border-border' />
          <small className='text-xs uppercase leading-tight'>{label}</small>
        </>
      )}
    </div>
  );
});
