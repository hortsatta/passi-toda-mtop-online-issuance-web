import type { Franchise } from './franchise.model';
import type { FranchiseRenewalUpsertFormData } from './franchise-renewal-form-data.model';

export type FranchiseRenewal = Omit<
  Franchise,
  | 'mvFileNo'
  | 'plateNo'
  | 'franchiseRenewals'
  | 'isExpired'
  | 'canRenew'
  | 'user'
> & {
  franchise?: Franchise;
};

export type FranchiseRenewalSlice = {
  franchiseRenewalFormData?: FranchiseRenewalUpsertFormData | null;
  setFranchiseRenewalFormData: (
    franchiseRenewalFormData?: FranchiseRenewalUpsertFormData,
  ) => void;
};
