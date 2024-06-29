import type { DriverProfileUpsertFormData } from '#/user/models/driver-profile-form-data.model';

export type FranchiseRenewalUpsertFormData = {
  isDriverOwner: boolean;
  vehicleORImgUrl: string;
  vehicleCRImgUrl: string;
  todaAssocMembershipImgUrl: string;
  driverLicenseNoImgUrl: string;
  brgyClearanceImgUrl: string;
  todaAssociationId: number;
  franchiseId?: number;
  voterRegRecordImgUrl?: string;
  driverProfile?: Partial<DriverProfileUpsertFormData>;
  driverProfileId?: number;
};
