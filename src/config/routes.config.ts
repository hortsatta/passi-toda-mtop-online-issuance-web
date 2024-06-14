export const baseMemberRoute = 'm';
export const baseIssuerRoute = 'i';
export const baseAdminRoute = 'a';

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
    },
    create: {
      to: 'register',
      label: 'Registration',
      pageTitle: 'Franchise Registration',
    },
    edit: {
      to: 'edit',
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
