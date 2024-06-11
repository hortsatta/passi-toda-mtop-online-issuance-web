import type { AuditTrail } from '#/core/models/core.model';
import type { User } from '#/user/models/user.model';
import type { TodaAssociation } from '#/toda-association/models/toda-association.model';
import type { FranchiseUpsertFormData } from './franchise-form-data.model';

export enum FranchiseApprovalStatus {
  PendingValidation = 'pending-validation',
  PendingPayment = 'pending-payment',
  Approved = 'approved',
  Rejected = 'rejected',
  Canceled = 'canceled',
}

export type Franchise = Partial<AuditTrail> & {
  id: number;
  mvFileNo: string;
  plateNo: string;
  ownerDriverLicenseNo: string;
  vehicleORImgUrl: string;
  vehicleCRImgUrl: string;
  todaAssocMembershipImgUrl: string;
  ownerDriverLicenseNoImgUrl: string;
  brgyClearanceImgUrl: string;
  approvalStatus: FranchiseApprovalStatus;
  approvalDate: Date | null;
  expiryDate: Date | null;
  todaAssociation: TodaAssociation;
  voterRegRecordImgUrl?: string;
  user?: User;
};

export type FranchiseDigest = {
  pendingValidations: Franchise[];
  pendingPayments: Franchise[];
  recentApprovals: Franchise[];
  recentRejections: Franchise[];
};

export type FranchiseSlice = {
  franchiseFormData?: FranchiseUpsertFormData | null;
  setFranchiseFormData: (franchiseFormData?: FranchiseUpsertFormData) => void;
};
