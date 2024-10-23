import { Fragment, memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Popover,
  PopoverButton,
  Transition,
  PopoverPanel,
  useClose,
  PopoverGroup,
} from '@headlessui/react';

import { menuList } from '#/config/menu.config';
import { UserRole } from '#/user/models/user.model';

import type { ComponentProps } from 'react';
import type { NavItem, NavItemList } from '#/base/models/base.model';

type Props = ComponentProps<'nav'> & {
  role?: UserRole;
};

const Item = memo(function ({ to, label }: NavItem) {
  const close = useClose();

  return (
    <Link
      to={to}
      className='text-base text-text/60 transition-colors hover:text-text/90 hover:no-underline'
      onClick={close}
    >
      {label}
    </Link>
  );
});

export const CoreNavMenu = memo(function ({ role, ...moreProps }: Props) {
  const list = useMemo(() => (!role ? null : menuList[role]), [role]);

  if (!role) return null;

  return (
    <nav {...moreProps}>
      <PopoverGroup className='flex items-center gap-4'>
        {list?.map(({ label, items }: NavItemList, index) => (
          <Fragment key={index}>
            <Popover className='relative'>
              <PopoverButton className='text-base uppercase text-text/60 outline-none transition-colors hover:text-text/90'>
                {label}
              </PopoverButton>
              <Transition
                enter='transition ease-out duration-200'
                enterFrom='opacity-0 translate-y-1'
                enterTo='opacity-100 translate-y-0'
                leave='transition ease-in duration-150'
                leaveFrom='opacity-100 translate-y-0'
                leaveTo='opacity-0 translate-y-1'
              >
                <PopoverPanel
                  anchor='bottom start'
                  className='mt-2.5 flex min-w-40 flex-col gap-2.5 rounded border border-border bg-backdrop-surface !px-4 !pb-3 !pt-2.5'
                >
                  {role &&
                    items.map(({ to, label }, index) => (
                      <Item key={`i-${index}`} to={to} label={label} />
                    ))}
                </PopoverPanel>
              </Transition>
            </Popover>
            {list.length - 1 > index && <span className='opacity-50'>●</span>}
          </Fragment>
        ))}
      </PopoverGroup>
    </nav>
  );
});
