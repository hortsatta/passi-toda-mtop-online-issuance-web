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

import {
  baseAdminRoute,
  baseIssuerRoute,
  baseMemberRoute,
  routeConfig,
} from '#/config/routes.config';
import { UserRole } from '#/user/models/user.model';

import type { ComponentProps } from 'react';

type Item = {
  to: string;
  label: string;
};

type ItemList = {
  label: string;
  items: Item[];
};

type Props = ComponentProps<'nav'> & {
  role?: UserRole;
};

type ItemProps = Item;

const menuList = {
  [UserRole.Member]: [
    {
      label: routeConfig.franchise.label,
      items: [
        {
          to: `/${baseMemberRoute}/${routeConfig.franchise.to}`,
          label: routeConfig.franchise.list.label,
        },
        {
          to: `/${baseMemberRoute}/${routeConfig.franchise.to}/${routeConfig.franchise.create.to}`,
          label: routeConfig.franchise.create.label,
        },
      ],
    },
  ],
  [UserRole.Issuer]: [
    {
      label: routeConfig.franchise.label,
      items: [
        {
          to: `/${baseIssuerRoute}/${routeConfig.franchise.to}`,
          label: routeConfig.franchise.list.label,
        },
      ],
    },
    {
      label: routeConfig.todaAssociation.label,
      items: [
        {
          to: `/${baseIssuerRoute}/${routeConfig.todaAssociation.to}`,
          label: routeConfig.todaAssociation.list.label,
        },
      ],
    },
    {
      label: routeConfig.reports.label,
      items: [
        {
          to: `/${routeConfig.reports.to}/${routeConfig.reports.franchises.to}`,
          label: routeConfig.reports.franchises.label,
        },
      ],
    },
  ],
  [UserRole.Admin]: [
    {
      label: routeConfig.franchise.label,
      items: [
        {
          to: `/${baseAdminRoute}/${routeConfig.franchise.to}`,
          label: routeConfig.franchise.list.label,
        },
      ],
    },
    {
      label: routeConfig.todaAssociation.label,
      items: [
        {
          to: `/${baseAdminRoute}/${routeConfig.todaAssociation.to}`,
          label: routeConfig.todaAssociation.list.label,
        },
        {
          to: `/${baseAdminRoute}/${routeConfig.todaAssociation.to}/${routeConfig.todaAssociation.create.to}`,
          label: routeConfig.todaAssociation.create.label,
        },
      ],
    },
    {
      label: routeConfig.reports.label,
      items: [
        {
          to: `/${routeConfig.reports.to}/${routeConfig.reports.franchises.to}`,
          label: routeConfig.reports.franchises.label,
        },
      ],
    },
  ],
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
  const list = useMemo(() => (!role ? null : menuList[role]), [role]);

  if (!role) return null;

  return (
    <nav {...moreProps}>
      <PopoverGroup className='flex items-center gap-4'>
        {list?.map(({ label, items }: ItemList, index) => (
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
