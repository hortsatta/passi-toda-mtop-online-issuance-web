import type { AuditTrail } from '#/core/models/core.model';
import type { User } from '#/user/models/user.model';
import type { DriverProfile } from '#/user/models/driver-profile.model';
import type { TodaAssociation } from '#/toda-association/models/toda-association.model';
import type { FranchiseUpsertFormData } from './franchise-form-data.model';
import type { FranchiseRenewal } from './franchise-renewal.model';
import type { FranchiseStatusRemark } from './franchise-status-remark.model';

export enum FranchiseApprovalStatus {
  PendingValidation = 'pending-validation',
  Validated = 'validated',
  Paid = 'paid',
  Approved = 'approved',
  Rejected = 'rejected',
  Canceled = 'canceled',
  Revoked = 'revoked',
}

export type Franchise = Partial<AuditTrail> & {
  id: number;
  mvFileNo: string;
  plateNo: string;
  vehicleORImgUrl: string;
  vehicleCRImgUrl: string;
  todaAssocMembershipImgUrl: string;
  driverLicenseNoImgUrl: string;
  brgyClearanceImgUrl: string;
  ctcCedulaImgUrl: string;
  approvalStatus: FranchiseApprovalStatus;
  approvalDate: Date | null;
  expiryDate: Date | null;
  todaAssociation: TodaAssociation;
  franchiseRenewals: FranchiseRenewal[];
  isDriverOwner: boolean;
  driverProfile?: DriverProfile;
  paymentORNo?: string;
  franchiseStatusRemarks?: FranchiseStatusRemark[];
  voterRegRecordImgUrl?: string;
  isExpired?: boolean;
  canRenew?: boolean;
  user?: User;
};

export type FranchiseDigest = {
  pendingValidations: Franchise[];
  validatedList: Franchise[];
  paidList: Franchise[];
  recentApprovals: Franchise[];
  recentRejections: Franchise[];
};

export type FranchiseSlice = {
  franchiseFormData?: FranchiseUpsertFormData | null;
  setFranchiseFormData: (franchiseFormData?: FranchiseUpsertFormData) => void;
};
