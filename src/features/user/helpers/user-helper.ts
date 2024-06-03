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
      fullName: `${lastName}, ${firstName} ${middleInitial}.`,
      reverseFullName: `${firstName} ${middleInitial}. ${lastName}`,
    };
  }
}

export function formatPhoneNumber(phoneNumber: string) {
  return phoneNumber.replace(/^(.{4})(.{3})/, '$1-$2-');
}
