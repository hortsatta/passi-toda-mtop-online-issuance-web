export const baseMemberRoute = 'm';

export const baseIssuerRoute = 'i';

export const routeConfig = {
  authSignIn: {
    name: 'sign-in',
    to: 'sign-in',
    // iconName: 'chalkboard-teacher',
    // createTo: 'create',
    // editTo: 'edit',
    // previewTo: 'preview',
    // schedule: {
    //   to: 'schedules',
    //   createTo: 'create',
    //   editTo: 'edit',
    // },
  },
  franchise: {
    name: 'franchises',
    to: 'franchises',
    label: 'Franchise',
    list: {
      label: 'List',
    },
    create: {
      to: 'register',
      label: 'Registration',
    },
    edit: {
      to: 'edit',
    },
  },
  user: {
    name: 'users',
    to: 'users',
    createTo: 'register',
  },
};
