import { Outlet } from 'react-router-dom';

import { CoreHeader } from './core-header.component';

export function CoreLayout() {
  return (
    <div className='flex min-h-screen flex-col'>
      <CoreHeader />
      <main className='max-w-main mx-auto w-full flex-1'>
        <Outlet />
      </main>
      {/* TODO footer */}
    </div>
  );
}
