import { memo } from 'react';
import cx from 'classix';

import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseButtonIcon } from '#/base/components/base-button-icon.component';

import type { ComponentProps } from 'react';
import type { User } from '../models/user.model';

type Props = ComponentProps<'div'> & {
  user: User;
  signOut: () => void;
};

export const CurrentUserCard = memo(function ({
  className,
  user: {
    userProfile: { fullName },
  },
  signOut,
  ...moreProps
}: Props) {
  return (
    <div
      className={cx('flex h-14 overflow-hidden rounded', className)}
      {...moreProps}
    >
      <div className='border-border bg-backdrop-input flex flex-col items-end justify-center rounded border border-r-0 px-3'>
        <span className='text-base leading-none text-white/50'>Hello,</span>
        <span className='text-base font-medium'>{fullName}</span>
      </div>
      <div className='flex h-full items-center gap-2.5'>
        <div className='border-border bg-backdrop-input flex h-full w-[49px] items-center justify-center rounded-r border px-2'>
          <BaseIcon name='user' size={24} />
        </div>
        <BaseButtonIcon iconName='sign-out' onClick={signOut} />
      </div>
    </div>
  );
});
