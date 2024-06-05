import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  Outlet,
} from 'react-router-dom';

import { baseMemberRoute, routeConfig } from '#/config/routes.config';
import { queryClient } from '#/config/react-query-client.config';
import { UserRole } from './user/models/user.model';
import {
  getFranchiseByIdLoader,
  getFranchisesLoader,
} from './franchise/loaders/member-franchise.loader';
import { CoreLayout } from './core/components/core-layout.component';
import { AuthProtectedRoute } from './user/components/auth-protected-route.component';
import { CoreHomePage } from './core/pages/core-home.page';
import { AuthSignInPage } from './user/pages/auth-sign-in.page';
import { FranchiseRegisterPage } from './franchise/pages/franchise-register.page';
import { MemberFranchiseListPage } from './franchise/pages/member-franchise-list.page';
import { MemberUserRegisterPage } from './user/pages/member-user-register.page';
import { MemberFranchiseSinglePage } from './franchise/pages/member-franchise-single.page';

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
    {/* ROLE MEMBER */}
    <Route
      path={baseMemberRoute}
      element={
        <AuthProtectedRoute roles={[UserRole.Member]}>
          <Outlet />
        </AuthProtectedRoute>
      }
    >
      <Route path={routeConfig.franchise.to} element={<Outlet />}>
        <Route
          index
          element={<MemberFranchiseListPage />}
          loader={getFranchisesLoader(queryClient)}
        />
        <Route path=':id' element={<Outlet />}>
          <Route
            index
            element={<MemberFranchiseSinglePage />}
            loader={getFranchiseByIdLoader(queryClient)}
          />
        </Route>
        <Route
          path={routeConfig.franchise.create.to}
          element={<FranchiseRegisterPage />}
        />
      </Route>
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
