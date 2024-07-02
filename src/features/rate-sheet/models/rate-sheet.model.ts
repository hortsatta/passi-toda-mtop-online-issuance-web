import type { AuditTrail } from '#/core/models/core.model';
import type { RateSheetUpsertFormData } from './rate-sheet-form-data.model';

export enum FeeType {
  FranchiseRegistration = 'franchise-registration',
  FranchiseRenewal = 'franchise-renewal',
}

export type RateSheet = Partial<AuditTrail> & {
  id: number;
  name: string;
  feeType: FeeType;
  rateSheetFees: RateSheetFee[];
};

export type RateSheetFee = Partial<AuditTrail> & {
  id: number;
  name: string;
  amount: number;
  isPenalty: boolean;
  activatePenaltyAfterExpiryDays?: number;
  isPenaltyActive?: boolean;
  rateSheet?: RateSheet;
};

export type RateSheetSlice = {
  rateSheetFormData?: RateSheetUpsertFormData | null;
  setRateSheetFormData: (
    rateSheetUpsertFormData?: RateSheetUpsertFormData,
  ) => void;
};
