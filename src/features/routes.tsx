import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
} from 'react-router-dom';

import { CoreLayout } from './core/components/core-layout.component';
import { CoreHomePage } from './core/pages/core-home.page';

const routes = createRoutesFromElements(
  <Route path='/' element={<CoreLayout />}>
    <Route index element={<CoreHomePage />} />
    {/* TODO member page */}
    {/* TODO issuer page */}
  </Route>,
);

export const router = createBrowserRouter(routes);
