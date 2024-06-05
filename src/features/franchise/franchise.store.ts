import { FranchiseUpsertFormData } from './models/franchise-form-data.model';

import type { StateCreator } from 'zustand';
import type { FranchiseSlice } from './models/franchise.model';

export const createFranchiseSlice: StateCreator<
  FranchiseSlice,
  [],
  [],
  FranchiseSlice
> = (set) => ({
  franchiseFormData: undefined,
  setFranchiseFormData: (franchiseFormData?: FranchiseUpsertFormData) =>
    set({ franchiseFormData: franchiseFormData || null }),
});
