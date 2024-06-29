import type { AuditTrail } from '#/core/models/core.model';
import type { TodaAssociation } from '#/toda-association/models/toda-association.model';
import type { DriverProfile } from '#/user/models/driver-profile.model';
import type { Franchise, FranchiseApprovalStatus } from './franchise.model';
import type { FranchiseRenewalUpsertFormData } from './franchise-renewal-form-data.model';

export type FranchiseRenewal = Partial<AuditTrail> & {
  id: number;
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
  franchise?: Franchise;
};

export type FranchiseRenewalSlice = {
  franchiseRenewalFormData?: FranchiseRenewalUpsertFormData | null;
  setFranchiseRenewalFormData: (
    franchiseRenewalFormData?: FranchiseRenewalUpsertFormData,
  ) => void;
};
