import type { StateCreator } from 'zustand';
import type { FranchiseRenewalUpsertFormData } from '../models/franchise-renewal-form-data.model';
import type { FranchiseRenewalSlice } from '../models/franchise-renewal.model';

export const createFranchiseRenewalSlice: StateCreator<
  FranchiseRenewalSlice,
  [],
  [],
  FranchiseRenewalSlice
> = (set) => ({
  franchiseRenewalFormData: undefined,
  setFranchiseRenewalFormData: (
    franchiseRenewalFormData?: FranchiseRenewalUpsertFormData,
  ) => set({ franchiseRenewalFormData: franchiseRenewalFormData || null }),
});
