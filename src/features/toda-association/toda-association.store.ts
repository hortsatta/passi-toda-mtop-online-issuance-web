import type { StateCreator } from 'zustand';
import type { TodaAssociationSlice } from './models/toda-association.model';
import type { TodaAssociationUpsertFormData } from './models/toda-association-form-data.model';

export const createTodaAssociationSlice: StateCreator<
  TodaAssociationSlice,
  [],
  [],
  TodaAssociationSlice
> = (set) => ({
  todaAssociationFormData: undefined,
  setTodaAssociationFormData: (
    todaAssociationFormData?: TodaAssociationUpsertFormData,
  ) => set({ todaAssociationFormData: todaAssociationFormData || null }),
});
