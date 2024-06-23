import type { AuditTrail } from '#/core/models/core.model';

export enum UserApprovalStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export enum UserRole {
  Admin = 'admin',
  Issuer = 'issuer',
  Treasurer = 'treasurer',
  Member = 'member',
}

export enum UserGender {
  Male = 'male',
  Female = 'female',
}

export enum UserCivilStatus {
  Single = 'single',
  Married = 'married',
  Widowed = 'widowed',
  LegallySeparated = 'legally-separated',
}

export type User = Partial<AuditTrail> & {
  id: number;
  role: UserRole;
  email: string;
  approvalStatus: UserApprovalStatus;
  approvalDate: Date | null;
  lastSignInDate: Date | null;
  userProfile: UserProfile;
};

export type UserProfile = Partial<AuditTrail> & {
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
  middleName?: string;
  fullName?: string;
  reverseFullName?: string;
};

export type UserSlice = {
  user?: User | null;
  setUser: (user?: User) => void;
};
