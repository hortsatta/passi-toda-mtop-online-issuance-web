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
    role,
    userProfile: { fullName },
  },
  signOut,
  ...moreProps
}: Props) {
  return (
    <div
      className={cx(
        'flex h-14 w-full overflow-hidden rounded lg:w-fit',
        className,
      )}
      {...moreProps}
    >
      <div className='flex w-full min-w-52 flex-col items-end justify-center gap-0.5 rounded border border-r-0 border-border bg-backdrop-input px-3 lg:w-fit'>
        <span className='text-base font-medium'>{fullName}</span>
        <span className='text-xs uppercase leading-none text-white/50'>
          {role}
        </span>
      </div>
      <div className='flex h-full items-center gap-2.5'>
        <div className='flex h-full w-[49px] items-center justify-center rounded-r border border-border bg-backdrop-input px-2'>
          <BaseIcon name='user' size={24} />
        </div>
        <BaseButtonIcon iconName='sign-out' onClick={signOut} />
      </div>
    </div>
  );
});
