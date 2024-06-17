import { Fragment, memo } from 'react';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import cx from 'classix';

import { BaseButtonSimple } from './base-button-simple.component';

import type { ComponentProps, ReactNode } from 'react';

type Props = Omit<ComponentProps<typeof Dialog>, 'children'> & {
  open: boolean;
  title?: string;
  description?: string;
  fullSize?: boolean;
  children?: ReactNode;
  onClose?: () => void;
  rightComponent?: ReactNode;
};

export const BaseModal = memo(function ({
  open,
  title,
  description,
  fullSize,
  children,
  onClose,
  onKeyDown,
  rightComponent,
}: Props) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-50'
        onClose={onClose}
        onKeyDown={onKeyDown}
      >
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/25' />
        </TransitionChild>
        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center px-4 py-10 text-center'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <DialogPanel
                className={cx(
                  'flex w-full transform flex-col overflow-hidden rounded bg-[#222226] px-8 py-6 text-left align-middle transition-all',
                  fullSize
                    ? 'h-[calc(100vh-5rem)] max-w-[860px]'
                    : 'max-w-[500px]',
                )}
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <DialogTitle
                      as='h3'
                      className='text-lg font-medium leading-none text-text'
                    >
                      {title}
                    </DialogTitle>
                    {description && (
                      <div className='mt-2'>
                        <p className='text-xs text-text/60'>{description}</p>
                      </div>
                    )}
                  </div>
                  <div className='flex items-center gap-2.5'>
                    {rightComponent}
                    <BaseButtonSimple
                      iconName='x'
                      iconSize={20}
                      onClick={onClose}
                    />
                  </div>
                </div>
                {(title || description) && (
                  <div className='flex items-center justify-center py-5'>
                    <div className='w-full border-b border-border' />
                  </div>
                )}
                <div className='min-h-0'>{children}</div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
});
