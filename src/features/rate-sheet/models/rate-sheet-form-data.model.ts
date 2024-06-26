import type { FeeType } from './rate-sheet.model';

export type RateSheetUpsertFormData = {
  name: string;
  feeType: FeeType;
  rateSheetFees: RateSheetFeeUpsertFormData[];
};

export type RateSheetFeeUpsertFormData = {
  name: string;
  amount: number;
};
