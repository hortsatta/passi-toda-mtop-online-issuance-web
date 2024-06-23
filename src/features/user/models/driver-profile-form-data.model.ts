import type { UserCivilStatus, UserGender } from './user.model';

export type DriverProfileUpsertFormData = {
  firstName: string;
  lastName: string;
  birthDate: Date;
  gender: UserGender;
  civilStatus: UserCivilStatus;
  religion: string;
  address: string;
  phoneNumber: string;
  driverLicenseNo: string;
  email?: string;
  middleName?: string;
};
