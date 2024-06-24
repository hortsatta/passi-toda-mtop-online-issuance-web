import { memo, useMemo } from 'react';
import isURL from 'validator/lib/isURL';
import cx from 'classix';

import { PDF_FILE_EXT } from '../helpers/base-file.helper';
import { BaseIcon } from './base-icon.component';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'img'> & {
  label?: string;
  wrapperProps?: ComponentProps<'div'>;
};

type FileViewerProps = ComponentProps<'img'> & {
  label?: string;
};

const FileViewer = memo(function ({
  className,
  src,
  label,
  ...moreProps
}: FileViewerProps) {
  const isPdf = useMemo(() => {
    const filename = src?.split('/').pop();
    return filename?.split('.').pop()?.includes(PDF_FILE_EXT);
  }, [src]);

  return isPdf ? (
    <div className='w-fit overflow-hidden rounded bg-white/90 px-1.5 py-2.5 text-red-600'>
      <BaseIcon name='file-pdf' size={64} />
    </div>
  ) : (
    <img
      className={cx('inline-block h-full w-full object-contain', className)}
      src={src}
      alt={label}
      {...moreProps}
    />
  );
});

export const BaseFieldImg = memo(function ({
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
      <div
        className={cx(
          'flex h-60 items-center justify-center overflow-hidden rounded bg-backdrop-surface',
          onClick && 'cursor-pointer',
        )}
        onClick={onClick}
      >
        {isURL(src || '') ? (
          <FileViewer src={src} alt={label} onClick={onClick} {...moreProps} />
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
