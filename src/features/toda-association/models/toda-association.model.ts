import type { AuditTrail } from '#/core/models/core.model';
import type { Franchise } from '#/franchise/models/franchise.model';
import type { TodaAssociationUpsertFormData } from './toda-association-form-data.model';

export type TodaAssociation = Partial<AuditTrail> & {
  id: number;
  name: string;
  authorizedRoute: string;
  presidentFirstName: string;
  presidentLastName: string;
  presidentMiddleName?: string;
  presidentFullName?: string;
  presidentReverseFullName?: string;
  franchiseCount?: number;
  franchises?: Franchise[];
};

export type TodaAssociationSlice = {
  todaAssociationFormData?: TodaAssociationUpsertFormData | null;
  setTodaAssociationFormData: (
    todaAssociationFormData?: TodaAssociationUpsertFormData,
  ) => void;
};
