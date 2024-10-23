import { Outlet } from 'react-router-dom';

import { useBoundStore } from '../hooks/use-store.hook';
import { CoreHeader } from './core-header.component';
import { CoreMobileHeader } from './core-mobile-header.component';

export function CoreLayout() {
  const isMobileMenuOpen = useBoundStore((state) => state.isMobileMenuOpen);

  return (
    <div className='flex min-h-screen flex-col'>
      <CoreHeader />
      {isMobileMenuOpen && <CoreMobileHeader />}
      <main className='mx-auto w-full max-w-main flex-1'>
        <Outlet />
      </main>
      {/* TODO footer */}
    </div>
  );
}
