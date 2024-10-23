import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classix';

import { menuList } from '#/config/menu.config';
import { UserRole } from '#/user/models/user.model';

import type { ComponentProps } from 'react';
import type { NavItemList } from '#/base/models/base.model';

type Props = ComponentProps<'nav'> & {
  role?: UserRole;
};

export const CoreMobileNavMenu = memo(function ({
  className,
  role,
  ...moreProps
}: Props) {
  const list = useMemo(() => (!role ? null : menuList[role]), [role]);

  return (
    <nav
      className={cx(
        'flex w-full flex-col gap-2.5 bg-backdrop-surface',
        className,
      )}
      {...moreProps}
    >
      {list?.map(({ label, items }: NavItemList, index) => (
        <div className='rounded border border-border' key={index}>
          <h6 className='w-full border-b border-border p-2.5 text-sm font-normal uppercase text-text/60 opacity-60 outline-none transition-colors hover:text-text/90'>
            {label}
          </h6>
          <div className='flex min-w-40 flex-col'>
            {role &&
              items.map(({ to, label }, itemIndex) => (
                <div key={`i-${itemIndex}`}>
                  <Link
                    to={to}
                    className='block w-full bg-backdrop-input px-4 py-2.5 text-base text-text/60 transition-colors hover:text-text/90 hover:no-underline'
                  >
                    {label}
                  </Link>
                  {itemIndex < items.length - 1 && (
                    <div className='border-b border-border' />
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
    </nav>
  );
});
