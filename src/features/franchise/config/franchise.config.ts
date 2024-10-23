import type { FranchiseStatusFieldError } from '../models/franchise-status-remark.model';

export const fieldNames: { [key: string]: FranchiseStatusFieldError } = {
  mvFileNo: { name: 'mvFileNo', label: 'MV File No.' },
  vehicleMake: { name: 'vehicleMake', label: 'Vehicle Make' },
  vehicleMotorNo: { name: 'vehicleMotorNo', label: 'Vehicle Motor No.' },
  vehicleChassisNo: { name: 'vehicleChassisNo', label: 'Vehicle Chassis No.' },
  plateNo: { name: 'plateNo', label: 'Plate No.' },
  todaAssociation: { name: 'todaAssociation', label: 'Toda Association' },
  vehicleORImgUrl: { name: 'vehicleORImgUrl', label: 'Vehicle OR' },
  vehicleCRImgUrl: { name: 'vehicleCRImgUrl', label: 'Vehicle CR' },
  todaAssocMembershipImgUrl: {
    name: 'todaAssocMembershipImgUrl',
    label: 'Toda Association Membership',
  },
  brgyClearanceImgUrl: {
    name: 'brgyClearanceImgUrl',
    label: 'Barangay Clearance',
  },
  ctcCedulaImgUrl: {
    name: 'ctcCedulaImgUrl',
    label: 'CTC (Cedula)',
  },
  voterRegRecordImgUrl: {
    name: 'voterRegRecordImgUrl',
    label: `Voter's Registration Record`,
  },
  driverLicenseNoImgUrl: {
    name: 'driverLicenseNoImgUrl',
    label: `Driver's License No.`,
  },
  driverFullName: { name: 'driverFullName', label: `Driver's Name` },
  driverBirthDate: { name: 'driverBirthDate', label: `Driver's Birthdate` },
  driverAge: { name: 'driverAge', label: `Driver's Age` },
  driverGender: { name: 'driverGender', label: `Driver's Sex` },
  driverCivilStatus: {
    name: 'driverCivilStatus',
    label: `Driver's Civil Status`,
  },
  driverReligion: { name: 'driverReligion', label: `Driver's Religion` },
  driverAddress: { name: 'driverAddress', label: `Driver's Address` },
  driverPhoneNumber: { name: 'driverPhoneNumber', label: `Driver's Phone No.` },
  driverLicenseNo: { name: 'driverLicenseNo', label: `Driver's License No.` },
  driverEmail: { name: 'driverEmail', label: `Driver's Email Address` },

  ownerFullName: { name: 'ownerFullName', label: `Owner's Name` },
  ownerBirthDate: { name: 'ownerBirthDate', label: `Owner's Birthdate` },
  ownerAge: { name: 'ownerAge', label: `Owner's Age` },
  ownerGender: { name: 'ownerGender', label: `Owner's Sex` },
  ownerCivilStatus: {
    name: 'ownerCivilStatus',
    label: `Owner's Civil Status`,
  },
  ownerReligion: { name: 'ownerReligion', label: `Owner's Religion` },
  ownerAddress: { name: 'ownerAddress', label: `Owner's Address` },
  ownerPhoneNumber: { name: 'ownerPhoneNumber', label: `Owner's Phone No.` },
  ownerLicenseNo: { name: 'ownerLicenseNo', label: `Owner's License No.` },
  ownerEmail: { name: 'ownerEmail', label: `Owner's Email Address` },
};
