import { UserGender } from '../models/user.model';
import { capitalize } from '#/core/helpers/string.helper';

export function generateFullNames(
  firstName: string,
  lastName: string,
  middleName?: string,
): {
  fullName: string;
  reverseFullName: string;
} {
  if (!middleName) {
    return {
      fullName: `${lastName}, ${firstName}`,
      reverseFullName: `${firstName} ${lastName}`,
    };
  } else {
    const middleInitial = middleName[0].toUpperCase();

    return {
      fullName: `${firstName} ${middleInitial}. ${lastName}`,
      reverseFullName: `${lastName}, ${firstName} ${middleInitial}.`,
    };
  }
}

export function formatPhoneNumber(phoneNumber: string) {
  return phoneNumber.replace(/^(.{4})(.{3})/, '$1-$2-');
}

export const genderSelectOptions = [
  {
    label: capitalize(UserGender.Male),
    value: UserGender.Male,
  },
  {
    label: capitalize(UserGender.Female),
    value: UserGender.Female,
  },
];
