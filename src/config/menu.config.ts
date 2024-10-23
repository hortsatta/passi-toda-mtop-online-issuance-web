import {
  baseAdminRoute,
  baseIssuerRoute,
  baseMemberRoute,
  baseTreasurerRoute,
  routeConfig,
} from '#/config/routes.config';
import { UserRole } from '#/user/models/user.model';

export const menuList = {
  [UserRole.Member]: [
    {
      label: routeConfig.franchise.label,
      items: [
        {
          to: `/${baseMemberRoute}/${routeConfig.franchise.to}`,
          label: routeConfig.franchise.list.label,
        },
        {
          to: `/${baseMemberRoute}/${routeConfig.franchise.to}/${routeConfig.franchise.create.to}`,
          label: routeConfig.franchise.create.label,
        },
      ],
    },
  ],
  [UserRole.Treasurer]: [
    {
      label: routeConfig.franchise.label,
      items: [
        {
          to: `/${baseTreasurerRoute}/${routeConfig.franchise.to}`,
          label: routeConfig.franchise.list.label,
        },
        {
          to: `/${baseTreasurerRoute}/${routeConfig.franchise.to}/${routeConfig.franchise.rates.to}`,
          label: routeConfig.franchise.rates.label,
        },
      ],
    },
  ],
  [UserRole.Issuer]: [
    {
      label: routeConfig.franchise.label,
      items: [
        {
          to: `/${baseIssuerRoute}/${routeConfig.franchise.to}`,
          label: routeConfig.franchise.list.label,
        },
        {
          to: `/${baseIssuerRoute}/${routeConfig.franchise.to}/${routeConfig.franchise.rates.to}`,
          label: routeConfig.franchise.rates.label,
        },
      ],
    },
    {
      label: routeConfig.todaAssociation.label,
      items: [
        {
          to: `/${baseIssuerRoute}/${routeConfig.todaAssociation.to}`,
          label: routeConfig.todaAssociation.list.label,
        },
      ],
    },
    {
      label: routeConfig.reports.label,
      items: [
        {
          to: `/${routeConfig.reports.to}/${routeConfig.reports.franchises.to}`,
          label: routeConfig.reports.franchises.label,
        },
      ],
    },
  ],
  [UserRole.Admin]: [
    {
      label: routeConfig.franchise.label,
      items: [
        {
          to: `/${baseAdminRoute}/${routeConfig.franchise.to}`,
          label: routeConfig.franchise.list.label,
        },
        {
          to: `/${baseAdminRoute}/${routeConfig.franchise.to}/${routeConfig.franchise.rates.to}`,
          label: routeConfig.franchise.rates.label,
        },
      ],
    },
    {
      label: routeConfig.todaAssociation.label,
      items: [
        {
          to: `/${baseAdminRoute}/${routeConfig.todaAssociation.to}`,
          label: routeConfig.todaAssociation.list.label,
        },
        {
          to: `/${baseAdminRoute}/${routeConfig.todaAssociation.to}/${routeConfig.todaAssociation.create.to}`,
          label: routeConfig.todaAssociation.create.label,
        },
      ],
    },
    {
      label: routeConfig.reports.label,
      items: [
        {
          to: `/${routeConfig.reports.to}/${routeConfig.reports.franchises.to}`,
          label: routeConfig.reports.franchises.label,
        },
      ],
    },
  ],
};
