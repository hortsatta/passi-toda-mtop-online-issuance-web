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
  baseTreasurerRoute,
  routeConfig,
} from '#/config/routes.config';
import { queryClient } from '#/config/react-query-client.config';
import { UserRole } from './user/models/user.model';
import { getReportFranchiseIssuanceLoader } from './report/loaders/report-franchise.loader';
import {
  getFranchiseByIdLoader as getMemberFranchiseByIdLoader,
  getFranchisesLoader as getMemberFranchisesLoader,
} from './franchise/loaders/member-franchise.loader';
import {
  getFranchiseByIdLoader as getTreasurerFranchiseByIdLoader,
  getFranchiseDigestLoader as getTreasurerFranchiseDigestLoader,
} from './franchise/loaders/treasurer-franchise.loader';
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
  getTodaAssociationWithFranchisesByIdLoader,
  getTodaAssociationsLoader,
} from './toda-association/loaders/toda-association.loader';
import {
  getLatestFranchiseRateSheetsLoader,
  getRateSheetByIdLoader,
} from './rate-sheet/loaders/rate-sheet.loader';
import { CoreLayout } from './core/components/core-layout.component';
import { AuthProtectedRoute } from './user/components/auth-protected-route.component';
import { AuthConfirmRegistrationPage } from './user/pages/auth-confirm-registration.page';
import { CoreHomePage } from './core/pages/core-home.page';
import { UserPasswordForgotPage } from './user/pages/user-password-forgot.page';
import { UserPasswordResetPage } from './user/pages/user-password-reset.page';
import { AuthSignInPage } from './user/pages/auth-sign-in.page';
import { FranchiseCheckerPage } from './franchise/pages/franchise-checker.page';
import { FranchiseRegisterPage } from './franchise/pages/franchise-register.page';
import { FranchiseRenewalPage } from './franchise/pages/franchise-renewal.page';
import { MemberFranchiseSinglePrintViewPage } from './franchise/pages/member-franchise-single-print-view.page';
import { ReportFranchisesPage } from './report/pages/report-franchises.page';
import { MemberUserRegisterPage } from './user/pages/member-user-register.page';
import { MemberFranchiseSinglePage } from './franchise/pages/member-franchise-single.page';
import { MemberFranchiseListPage } from './franchise/pages/member-franchise-list.page';
import { TreasurerFranchiseListPage } from './franchise/pages/treasurer-franchise-list.page';
import { TreasurerFranchiseSinglePage } from './franchise/pages/treasurer-franchise-single.page';
import { TreasurerFranchiseSinglePrintViewPage } from './franchise/pages/treasurer-franchise-single-print-view.page';
import { IssuerFranchiseListPage } from './franchise/pages/issuer-franchise-list.page';
import { IssuerFranchiseSinglePage } from './franchise/pages/issuer-franchise-single.page';
import { IssuerFranchiseSinglePrintViewPage } from './franchise/pages/issuer-franchise-single-print-view.page';
import { IssuerTodaAssociationListPage } from './toda-association/pages/issuer-toda-association-list.page';
import { IssuerTodaAssociationSinglePage } from './toda-association/pages/issuer-toda-association-single.page';
import { AdminFranchiseListPage } from './franchise/pages/admin-franchise-list.page';
import { AdminFranchiseSinglePage } from './franchise/pages/admin-franchise-single.page';
import { AdminTodaAssociationListPage } from './toda-association/pages/admin-toda-association-list.page';
import { AdminTodaAssociationSinglePage } from './toda-association/pages/admin-toda-association-single.page';
import { AdminTodaAssociationFranchiseListPage } from './toda-association/pages/admin-toda-association-franchise-list.page';
import { IssuerTodaAssociationFranchiseListPage } from './toda-association/pages/issuer-toda-association-franchise-list.page';
import { TodaAssociationCreatePage } from './toda-association/pages/toda-association-create.page';
import { TodaAssociationEditPage } from './toda-association/pages/toda-association-edit.page';
import { AdminRateSheetFranchiseFeesPage } from './rate-sheet/pages/admin-rate-sheet-franchise-fees.page';
import { TreasurerIssuerRateSheetFranchiseFeesPage } from './rate-sheet/pages/treasurer-issuer-rate-sheet-franchise-fees.page';
import { RateSheetFranchiseUpdatePage } from './rate-sheet/pages/rate-sheet-franchise-update.page';

const routes = createRoutesFromElements(
  <Route path='/' element={<CoreLayout />}>
    <Route index element={<CoreHomePage />} />
    <Route
      path={routeConfig.auth.signIn.to}
      element={
        <AuthProtectedRoute reverse>
          <AuthSignInPage />
        </AuthProtectedRoute>
      }
    />
    <Route path={routeConfig.auth.password.to} element={<Outlet />}>
      <Route
        path={routeConfig.auth.password.forgot.to}
        element={
          <AuthProtectedRoute reverse>
            <UserPasswordForgotPage />
          </AuthProtectedRoute>
        }
      />
      <Route
        path={routeConfig.auth.password.reset.to}
        element={
          <AuthProtectedRoute reverse>
            <UserPasswordResetPage />
          </AuthProtectedRoute>
        }
      />
    </Route>
    <Route path={routeConfig.user.to} element={<Outlet />}>
      <Route
        path={routeConfig.user.create.to}
        element={
          <AuthProtectedRoute reverse>
            <MemberUserRegisterPage />
          </AuthProtectedRoute>
        }
      />
    </Route>
    <Route
      path={routeConfig.auth.confirmRegistration.to}
      element={<AuthConfirmRegistrationPage />}
    />
    <Route
      path={routeConfig.franchiseChecker.to}
      element={<FranchiseCheckerPage />}
    />
    <Route
      path={routeConfig.reports.to}
      element={
        <AuthProtectedRoute roles={[UserRole.Issuer, UserRole.Admin]}>
          <Outlet />
        </AuthProtectedRoute>
      }
    >
      <Route
        path={routeConfig.reports.franchises.to}
        element={<ReportFranchisesPage />}
        loader={getReportFranchiseIssuanceLoader(queryClient)}
      />
    </Route>
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
          <Route
            path={routeConfig.franchise.renew.to}
            element={<FranchiseRenewalPage />}
            loader={getMemberFranchiseByIdLoader(queryClient)}
          />
          <Route
            path={routeConfig.franchise.single.print.to}
            element={<MemberFranchiseSinglePrintViewPage />}
            loader={getMemberFranchiseByIdLoader(queryClient)}
          />
        </Route>
        <Route
          path={routeConfig.franchise.create.to}
          element={<FranchiseRegisterPage />}
        />
      </Route>
    </Route>
    {/* ROLE TREASURER */}
    <Route
      path={baseTreasurerRoute}
      element={
        <AuthProtectedRoute roles={[UserRole.Treasurer]}>
          <Outlet />
        </AuthProtectedRoute>
      }
    >
      <Route path={routeConfig.franchise.to} element={<Outlet />}>
        <Route
          index
          element={<TreasurerFranchiseListPage />}
          loader={getTreasurerFranchiseDigestLoader(queryClient)}
        />
        <Route path=':id' element={<Outlet />}>
          <Route
            index
            element={<TreasurerFranchiseSinglePage />}
            loader={getTreasurerFranchiseByIdLoader(queryClient)}
          />
          <Route
            path={routeConfig.franchise.single.print.to}
            element={<TreasurerFranchiseSinglePrintViewPage />}
            loader={getTreasurerFranchiseByIdLoader(queryClient)}
          />
        </Route>
        <Route path={routeConfig.franchise.rates.to} element={<Outlet />}>
          <Route
            index
            element={<TreasurerIssuerRateSheetFranchiseFeesPage />}
            loader={getLatestFranchiseRateSheetsLoader(queryClient)}
          />
        </Route>
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
          <Route
            path={routeConfig.franchise.single.print.to}
            element={<IssuerFranchiseSinglePrintViewPage />}
            loader={getIssuerFranchiseByIdLoader(queryClient)}
          />
        </Route>
        <Route path={routeConfig.franchise.rates.to} element={<Outlet />}>
          <Route
            index
            element={<TreasurerIssuerRateSheetFranchiseFeesPage />}
            loader={getLatestFranchiseRateSheetsLoader(queryClient)}
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
          <Route
            path={routeConfig.todaAssociation.franchise.to}
            element={<IssuerTodaAssociationFranchiseListPage />}
            loader={getTodaAssociationWithFranchisesByIdLoader(queryClient)}
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
          <Route
            path={routeConfig.franchise.single.print.to}
            element={<IssuerFranchiseSinglePrintViewPage />}
            loader={getAdminFranchiseByIdLoader(queryClient)}
          />
        </Route>
        <Route path={routeConfig.franchise.rates.to} element={<Outlet />}>
          <Route
            index
            element={<AdminRateSheetFranchiseFeesPage />}
            loader={getLatestFranchiseRateSheetsLoader(queryClient)}
          />
          <Route path=':id' element={<Outlet />}>
            <Route
              path={routeConfig.franchise.rates.update.to}
              element={<RateSheetFranchiseUpdatePage />}
              loader={getRateSheetByIdLoader(queryClient)}
            />
          </Route>
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
          <Route
            path={routeConfig.todaAssociation.franchise.to}
            element={<AdminTodaAssociationFranchiseListPage />}
            loader={getTodaAssociationWithFranchisesByIdLoader(queryClient)}
          />
        </Route>
        <Route
          path={routeConfig.todaAssociation.create.to}
          element={<TodaAssociationCreatePage />}
        />
      </Route>
    </Route>
  </Route>,
);

export const router = createBrowserRouter(routes);
