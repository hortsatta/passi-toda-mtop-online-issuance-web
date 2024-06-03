import type { UserGender } from './user.model';

export type UserRegisterFormData = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  phoneNumber: string;
  gender: UserGender;
  middleName?: string;
};
