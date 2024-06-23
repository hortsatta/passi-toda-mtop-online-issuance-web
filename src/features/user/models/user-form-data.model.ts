import type { UserCivilStatus, UserGender } from './user.model';

export type UserCreateFormData = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  phoneNumber: string;
  gender: UserGender;
  civilStatus: UserCivilStatus;
  religion: string;
  address: string;
  driverLicenseNo?: string;
  middleName?: string;
};

export type UserUpdateFormData = {
  email: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  phoneNumber: string;
  gender: UserGender;
  civilStatus: UserCivilStatus;
  religion: string;
  address: string;
  driverLicenseNo?: string;
  middleName?: string;
};
