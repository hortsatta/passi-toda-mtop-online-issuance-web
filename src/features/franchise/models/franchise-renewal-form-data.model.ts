import type { FranchiseUpsertFormData } from './franchise-form-data.model';

export type FranchiseRenewalUpsertFormData = Omit<
  FranchiseUpsertFormData,
  'mvFileNo' | 'plateNo'
> & {
  franchiseId: number;
};
