import type { AuditTrail } from '#/core/models/core.model';

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
  rateSheet?: RateSheet;
};
