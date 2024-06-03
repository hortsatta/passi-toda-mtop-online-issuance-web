import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { router } from './routes';
import { AuthSessionSubscriber } from './user/components/auth-session-subscriber.component';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthSessionSubscriber />
      <RouterProvider router={router} />
      {/* // TODO <Toaster /> */}
    </QueryClientProvider>
  );
}
