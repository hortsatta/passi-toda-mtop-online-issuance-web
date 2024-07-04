import type { DriverProfileUpsertFormData } from '#/user/models/driver-profile-form-data.model';

export type FranchiseUpsertFormData = {
  mvFileNo: string;
  plateNo: string;
  isDriverOwner: boolean;
  vehicleORImgUrl: string;
  vehicleCRImgUrl: string;
  todaAssocMembershipImgUrl: string;
  driverLicenseNoImgUrl: string;
  brgyClearanceImgUrl: string;
  ctcCedulaImgUrl: string;
  todaAssociationId: number;
  voterRegRecordImgUrl?: string;
  driverProfile?: Partial<DriverProfileUpsertFormData>;
  driverProfileId?: number;
  userDriverLicenseNo?: string;
};
