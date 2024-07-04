import { UserRole } from '#/user/models/user.model';

export const baseMemberRoute = 'm';
export const baseTreasurerRoute = 't';
export const baseIssuerRoute = 'i';
export const baseAdminRoute = 'a';

export const userBaseTo = {
  [UserRole.Member]: `/${baseMemberRoute}`,
  [UserRole.Treasurer]: `/${baseTreasurerRoute}`,
  [UserRole.Issuer]: `/${baseIssuerRoute}`,
  [UserRole.Admin]: `/${baseAdminRoute}`,
};

export const routeConfig = {
  authSignIn: {
    name: 'sign-in',
    to: 'sign-in',
    pageTitle: 'Sign In',
  },
  franchiseChecker: {
    to: 'franchise-checker',
    pageTitle: 'Franchise Checker',
  },
  franchise: {
    name: 'franchises',
    to: 'franchises',
    label: 'Franchise',
    list: {
      label: 'List',
      pageTitle: 'Franchises',
    },
    single: {
      pageTitle: 'Franchise',
      print: {
        to: 'print',
        label: 'Franchise Issuance Print',
        pageTitle: 'Franchise Issuance Print',
      },
    },
    create: {
      to: 'register',
      label: 'Registration',
      pageTitle: 'Franchise Registration',
    },
    edit: {
      to: 'edit',
    },
    renew: {
      to: 'renew',
      label: 'Renewal',
      pageTitle: 'Franchise Renewal',
    },
    reports: {
      to: 'reports',
      label: 'Reports',
      pageTitle: 'Franchise Report',
    },
    rates: {
      to: 'rates',
      label: 'Rates',
      pageTitle: 'Franchise Issuance Rates',
      create: {
        to: 'add',
        label: 'Add New',
        pageTitle: 'Add New Franchise Issuance Fee',
      },
      update: {
        to: 'update',
        label: 'Update',
        pageTitle: 'Update Franchise Issuance Fee',
      },
    },
  },
  todaAssociation: {
    name: 'toda-associations',
    to: 'toda-associations',
    label: 'Toda Association',
    list: {
      label: 'List',
      pageTitle: 'TODA Associations',
    },
    single: {
      pageTitle: 'Franchise',
    },
    create: {
      to: 'add',
      label: 'Add New',
      pageTitle: 'Add New TODA Association',
    },
    edit: {
      to: 'edit',
      label: 'Edit',
      pageTitle: 'Edit TODA Association',
    },
    franchise: {
      to: 'franchise',
      label: 'Franchise',
      pageTitle: 'TODA Association Franchises',
    },
  },
  reports: {
    name: 'reports',
    to: 'reports',
    label: 'Reports',
    franchises: {
      to: 'franchises',
      label: 'Franchises',
      pageTitle: 'Franchise Report',
    },
  },
  user: {
    name: 'users',
    to: 'users',
    create: {
      to: 'register',
      pageTitle: 'Sign Up',
    },
  },
};
