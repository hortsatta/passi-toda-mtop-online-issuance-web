import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  Outlet,
} from 'react-router-dom';

import { routeConfig } from '#/config/routes.config';
import { UserRole } from './user/models/user.model';
import { AuthProtectedRoute } from './user/components/auth-protected-route.component';
import { CoreLayout } from './core/components/core-layout.component';
import { CoreHomePage } from './core/pages/core-home.page';
import { AuthSignInPage } from './user/pages/auth-sign-in.page';
import { MemberFranchiseListPage } from './franchise/pages/member-franchise-list.page';
import { FranchiseRegisterPage } from './franchise/pages/franchise-register.page';
import { MemberUserRegisterPage } from './user/pages/member-user-register.page';

const routes = createRoutesFromElements(
  <Route path='/' element={<CoreLayout />}>
    <Route index element={<CoreHomePage />} />
    <Route
      path={routeConfig.authSignIn.to}
      element={
        <AuthProtectedRoute reverse>
          <AuthSignInPage />
        </AuthProtectedRoute>
      }
    />
    <Route path={routeConfig.franchise.to} element={<Outlet />}>
      <Route index element={<MemberFranchiseListPage />} />
      <Route
        path={routeConfig.franchise.createTo}
        element={
          <AuthProtectedRoute roles={[UserRole.Member]}>
            <FranchiseRegisterPage />
          </AuthProtectedRoute>
        }
      />
    </Route>
    <Route path={routeConfig.user.to} element={<Outlet />}>
      <Route
        path={routeConfig.user.createTo}
        element={
          <AuthProtectedRoute reverse>
            <MemberUserRegisterPage />
          </AuthProtectedRoute>
        }
      />
    </Route>
  </Route>,
);

export const router = createBrowserRouter(routes);
