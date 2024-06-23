import type { AuditTrail } from '#/core/models/core.model';
import type { User } from '#/user/models/user.model';
import type { TodaAssociation } from '#/toda-association/models/toda-association.model';
import type { FranchiseUpsertFormData } from './franchise-form-data.model';
import type { DriverProfile } from '#/user/models/driver-profile.model';

export enum FranchiseApprovalStatus {
  PendingValidation = 'pending-validation',
  Validated = 'validated',
  Paid = 'paid',
  Approved = 'approved',
  Rejected = 'rejected',
  Canceled = 'canceled',
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
  approvalStatus: FranchiseApprovalStatus;
  approvalDate: Date | null;
  expiryDate: Date | null;
  todaAssociation: TodaAssociation;
  isDriverOwner: boolean;
  driverProfile?: DriverProfile;
  voterRegRecordImgUrl?: string;
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
