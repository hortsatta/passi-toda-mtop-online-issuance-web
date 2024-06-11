import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  Outlet,
} from 'react-router-dom';

import {
  baseAdminRoute,
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
  getFranchiseDigestLoader as getIssuerFranchiseDigestLoader,
  getFranchiseByIdLoader as getIssuerFranchiseByIdLoader,
} from './franchise/loaders/issuer-franchise.loader';
import {
  getFranchiseDigestLoader as getAdminFranchiseDigestLoader,
  getFranchiseByIdLoader as getAdminFranchiseByIdLoader,
} from './franchise/loaders/admin-franchise.loader';
import {
  getTodaAssociationByIdLoader,
  getTodaAssociationsLoader,
} from './toda-association/loaders/toda-association.loader';
import { CoreLayout } from './core/components/core-layout.component';
import { AuthProtectedRoute } from './user/components/auth-protected-route.component';
import { CoreHomePage } from './core/pages/core-home.page';
import { AuthSignInPage } from './user/pages/auth-sign-in.page';
import { FranchiseRegisterPage } from './franchise/pages/franchise-register.page';
import { MemberUserRegisterPage } from './user/pages/member-user-register.page';
import { MemberFranchiseSinglePage } from './franchise/pages/member-franchise-single.page';
import { MemberFranchiseListPage } from './franchise/pages/member-franchise-list.page';
import { IssuerFranchiseListPage } from './franchise/pages/issuer-franchise-list.page';
import { IssuerFranchiseSinglePage } from './franchise/pages/issuer-franchise-single.page';
import { IssuerTodaAssociationListPage } from './toda-association/pages/issuer-toda-association-list.page';
import { IssuerTodaAssociationSinglePage } from './toda-association/pages/issuer-toda-association-single.page';
import { AdminFranchiseListPage } from './franchise/pages/admin-franchise-list.page';
import { AdminFranchiseSinglePage } from './franchise/pages/admin-franchise-single.page';
import { AdminTodaAssociationListPage } from './toda-association/pages/admin-toda-association-list.page';
import { AdminTodaAssociationSinglePage } from './toda-association/pages/admin-toda-association-single.page';
import { TodaAssociationCreatePage } from './toda-association/pages/toda-association-create.page';
import { TodaAssociationEditPage } from './toda-association/pages/toda-association-edit.page';

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
          loader={getMemberFranchisesLoader(queryClient)}
        />
        <Route path=':id' element={<Outlet />}>
          <Route
            index
            element={<MemberFranchiseSinglePage />}
            loader={getMemberFranchiseByIdLoader(queryClient)}
          />
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
          loader={getIssuerFranchiseDigestLoader(queryClient)}
        />
        <Route path=':id' element={<Outlet />}>
          <Route
            index
            element={<IssuerFranchiseSinglePage />}
            loader={getIssuerFranchiseByIdLoader(queryClient)}
          />
        </Route>
      </Route>
      <Route path={routeConfig.todaAssociation.to} element={<Outlet />}>
        <Route
          index
          element={<IssuerTodaAssociationListPage />}
          loader={getTodaAssociationsLoader(queryClient)}
        />
        <Route path=':id' element={<Outlet />}>
          <Route
            index
            element={<IssuerTodaAssociationSinglePage />}
            loader={getTodaAssociationByIdLoader(queryClient)}
          />
        </Route>
      </Route>
    </Route>
    {/* ROLE ADMIN */}
    <Route
      path={baseAdminRoute}
      element={
        <AuthProtectedRoute roles={[UserRole.Admin]}>
          <Outlet />
        </AuthProtectedRoute>
      }
    >
      <Route path={routeConfig.franchise.to} element={<Outlet />}>
        <Route
          index
          element={<AdminFranchiseListPage />}
          loader={getAdminFranchiseDigestLoader(queryClient)}
        />
        <Route path=':id' element={<Outlet />}>
          <Route
            index
            element={<AdminFranchiseSinglePage />}
            loader={getAdminFranchiseByIdLoader(queryClient)}
          />
        </Route>
      </Route>
      <Route path={routeConfig.todaAssociation.to} element={<Outlet />}>
        <Route
          index
          element={<AdminTodaAssociationListPage />}
          loader={getTodaAssociationsLoader(queryClient)}
        />
        <Route path=':id' element={<Outlet />}>
          <Route
            index
            element={<AdminTodaAssociationSinglePage />}
            loader={getTodaAssociationByIdLoader(queryClient)}
          />
          <Route
            path={routeConfig.todaAssociation.edit.to}
            element={<TodaAssociationEditPage />}
          />
        </Route>
        <Route
          path={routeConfig.todaAssociation.create.to}
          element={<TodaAssociationCreatePage />}
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
