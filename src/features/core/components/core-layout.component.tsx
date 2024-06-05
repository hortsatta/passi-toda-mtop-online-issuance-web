import { Outlet } from 'react-router-dom';

import { CoreHeader } from './core-header.component';

export function CoreLayout() {
  return (
    <div className='flex min-h-screen flex-col'>
      <CoreHeader />
      <main className='mx-auto w-full max-w-main flex-1'>
        <Outlet />
      </main>
      {/* TODO footer */}
    </div>
  );
}
