import type { StateCreator } from 'zustand';
import type { RateSheetSlice } from './models/rate-sheet.model';
import type { RateSheetUpsertFormData } from './models/rate-sheet-form-data.model';

export const createRateSheetSlice: StateCreator<
  RateSheetSlice,
  [],
  [],
  RateSheetSlice
> = (set) => ({
  rateSheetFormData: undefined,
  setRateSheetFormData: (rateSheetFormData?: RateSheetUpsertFormData) =>
    set({ rateSheetFormData: rateSheetFormData || null }),
});
