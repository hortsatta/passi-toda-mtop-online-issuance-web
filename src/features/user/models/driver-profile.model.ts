import type { AuditTrail } from '#/core/models/core.model';
import type { UserCivilStatus, UserGender } from './user.model';

export type DriverProfile = Partial<AuditTrail> & {
  id: number;
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
  fullName?: string;
  reverseFullName?: string;
};
