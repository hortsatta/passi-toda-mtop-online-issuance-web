import { memo } from 'react';
import { Link } from 'react-router-dom';
import {
  Popover,
  PopoverButton,
  Transition,
  PopoverPanel,
  useClose,
} from '@headlessui/react';

import {
  baseIssuerRoute,
  baseMemberRoute,
  routeConfig,
} from '#/config/routes.config';
import { UserRole } from '#/user/models/user.model';

import type { ComponentProps } from 'react';

type ItemProps = {
  to: string;
  label: string;
};

type Props = ComponentProps<'nav'> & {
  role?: UserRole;
};

const items = {
  [UserRole.Member]: [
    {
      to: `/${baseMemberRoute}/${routeConfig.franchise.to}`,
      label: routeConfig.franchise.list.label,
    },
    {
      to: `/${baseMemberRoute}/${routeConfig.franchise.to}/${routeConfig.franchise.create.to}`,
      label: routeConfig.franchise.create.label,
    },
  ],
  [UserRole.Issuer]: [
    {
      to: `/${baseIssuerRoute}/${routeConfig.franchise.to}`,
      label: routeConfig.franchise.list.label,
    },
  ],
  [UserRole.Admin]: [],
};

const Item = memo(function ({ to, label }: ItemProps) {
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
  return (
    <nav {...moreProps}>
      <Popover>
        <PopoverButton className='text-base uppercase text-text/60 outline-none transition-colors hover:text-text/90'>
          {routeConfig.franchise.label}
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
            anchor='bottom'
            className='mt-2.5 flex min-w-40 flex-col gap-2.5 rounded border border-border bg-backdrop-surface !px-4 !pb-3 !pt-2.5'
          >
            {role &&
              items[role].map(({ to, label }, index) => (
                <Item key={`i-${index}`} to={to} label={label} />
              ))}
          </PopoverPanel>
        </Transition>
      </Popover>
    </nav>
  );
});
