import type { AuditTrail } from '#/core/models/core.model';

export enum FeeType {
  FranchiseRegistration = 'franchise-registration',
  FranchiseRenewal = 'franchise-renewal',
}

export type RateSheet = Partial<AuditTrail> & {
  name: string;
  feeType: FeeType;
  rateSheetFees: RateSheetFee[];
};

export type RateSheetFee = Partial<AuditTrail> & {
  name: string;
  amount: number;
  rateSheet?: RateSheet;
};
