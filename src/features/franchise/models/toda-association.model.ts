import type { AuditTrail } from '#/core/models/core.model';
import type { Franchise } from './franchise.model';

export type TodaAssociation = Partial<AuditTrail> & {
  id: number;
  name: string;
  authorizedRoute: string;
  presidentFirstName: string;
  presidentLastName: string;
  presidentMiddleName?: string;
  presidentFullName?: string;
  presidentReverseFullName?: string;
  franchises?: Franchise[];
};
