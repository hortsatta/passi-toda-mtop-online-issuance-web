import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  Outlet,
} from 'react-router-dom';

import {
  baseIssuerRoute,
  baseMemberRoute,
  routeConfig,
} from '#/config/routes.config';
import { queryClient } from '#/config/react-query-client.config';
import { UserRole } from './user/models/user.model';
import {
  getFranchiseByIdLoader as getMemberFranchiseByIdLoader,
  getFranchisesLoader as getMemberFranchisesLoader,
} from './franchise/loaders/member-franchise.loader';
import {
  getFranchiseDigestLoader,
  getFranchiseByIdLoader as getIssuerFranchiseByIdLoader,
} from './franchise/loaders/issuer-franchise.loader';
import { CoreLayout } from './core/components/core-layout.component';
import { AuthProtectedRoute } from './user/components/auth-protected-route.component';
import { CoreHomePage } from './core/pages/core-home.page';
import { AuthSignInPage } from './user/pages/auth-sign-in.page';
import { MemberUserRegisterPage } from './user/pages/member-user-register.page';
import { MemberFranchiseSinglePage } from './franchise/pages/member-franchise-single.page';
import { FranchiseRegisterPage } from './franchise/pages/franchise-register.page';
import { MemberFranchiseListPage } from './franchise/pages/member-franchise-list.page';
import { IssuerFranchiseListPage } from './franchise/pages/issuer-franchise-list.page';
import { IssuerFranchiseSinglePage } from './franchise/pages/issuer-franchise-single.page';

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
    <Route path={baseMemberRoute} element={<Outlet />}>
      <Route path={routeConfig.franchise.to} element={<Outlet />}>
        <Route
          element={
            <AuthProtectedRoute roles={[UserRole.Member]}>
              <Outlet />
            </AuthProtectedRoute>
          }
        >
          <Route
            index
            element={<MemberFranchiseListPage />}
            loader={getMemberFranchisesLoader(queryClient)}
          />
          <Route path=':id' element={<Outlet />}>
            <Route
              index
              element={<MemberFranchiseSinglePage />}
              loader={getMemberFranchiseByIdLoader(queryClient)}
            />
          </Route>
        </Route>
        <Route
          path={routeConfig.franchise.create.to}
          element={<FranchiseRegisterPage />}
        />
      </Route>
    </Route>
    {/* ROLE ISSUER */}
    <Route
      path={baseIssuerRoute}
      element={
        <AuthProtectedRoute roles={[UserRole.Issuer]}>
          <Outlet />
        </AuthProtectedRoute>
      }
    >
      <Route path={routeConfig.franchise.to} element={<Outlet />}>
        <Route
          index
          element={<IssuerFranchiseListPage />}
          loader={getFranchiseDigestLoader(queryClient)}
        />
        <Route path=':id' element={<Outlet />}>
          <Route
            index
            element={<IssuerFranchiseSinglePage />}
            loader={getIssuerFranchiseByIdLoader(queryClient)}
          />
        </Route>
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
