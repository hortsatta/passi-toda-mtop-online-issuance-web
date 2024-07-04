import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { capitalize } from '#/core/helpers/string.helper';
import { BaseFieldText } from '#/base/components/base-field-text.component';
import { UserCivilStatus } from '#/user/models/user.model';
import { fieldNames } from '../config/franchise.config';

import type { ComponentProps, Dispatch, SetStateAction } from 'react';
import type { Franchise } from '../models/franchise.model';
import type { FranchiseStatusFieldError } from '../models/franchise-status-remark.model';

type Props = ComponentProps<'div'> & {
  franchise: Franchise;
  fieldErrors?: FranchiseStatusFieldError[];
  canHighlight?: boolean;
  setFieldErrors?: Dispatch<SetStateAction<FranchiseStatusFieldError[]>>;
};

export const FranchiseOwnerInfo = memo(function ({
  className,
  franchise,
  fieldErrors,
  canHighlight,
  setFieldErrors,
  ...moreProps
}: Props) {
  const statusFieldRemarks = useMemo(() => {
    const target = franchise.franchiseRenewals.length
      ? franchise.franchiseRenewals[0]
      : franchise;

    return (
      target.franchiseStatusRemarks?.filter((sr) => sr.fieldName?.length) || []
    );
  }, [franchise]);

  const [
    ownerReverseFullName,
    ownerBirthDate,
    ownerGender,
    ownerCivilStatus,
    ownerReligion,
    ownerAddress,
    ownerPhoneNumber,
    ownerLicenseNo,
    ownerEmail,
  ] = useMemo(
    () => [
      franchise.user?.userProfile.reverseFullName || '',
      dayjs(franchise.user?.userProfile.birthDate || '').format('MMM DD, YYYY'),
      capitalize(franchise.user?.userProfile.gender || ''),
      franchise.user?.userProfile.civilStatus ===
      UserCivilStatus.LegallySeparated
        ? 'Legally Separated'
        : capitalize(franchise.user?.userProfile.civilStatus || ''),
      franchise.user?.userProfile.religion || '',
      franchise.user?.userProfile.address || '',
      franchise.user?.userProfile.phoneNumber || '',
      franchise.user?.userProfile.driverLicenseNo || '',
      franchise.user?.email || '',
    ],
    [franchise],
  );

  const getError = useCallback(
    (fieldError: FranchiseStatusFieldError) =>
      canHighlight
        ? fieldErrors?.some((fe) => fe.name === fieldError.name)
        : statusFieldRemarks.some((sr) => sr.fieldName === fieldError.name),
    [canHighlight, fieldErrors, statusFieldRemarks],
  );

  const handleFieldClick = useCallback(
    (value: FranchiseStatusFieldError) => () => {
      if (!setFieldErrors) return;

      const exist = fieldErrors?.some((fe) => fe.name === value.name);
      const newValue = exist
        ? (fieldErrors || []).filter((fe) => fe.name !== value.name)
        : [...(fieldErrors || []), value];
      setFieldErrors(newValue);
    },
    [fieldErrors, setFieldErrors],
  );

  return (
    <div
      className={cx('flex w-full flex-1 flex-col gap-4', className)}
      {...moreProps}
    >
      <h4>Owner Info</h4>
      <div className='grid w-full grid-cols-3 gap-4'>
        <BaseFieldText
          label='Name'
          error={getError(fieldNames.ownerFullName)}
          onClick={
            canHighlight
              ? handleFieldClick(fieldNames.ownerFullName)
              : undefined
          }
        >
          {ownerReverseFullName}
        </BaseFieldText>
        <BaseFieldText
          label='Date of Birth'
          error={getError(fieldNames.ownerBirthDate)}
          onClick={
            canHighlight
              ? handleFieldClick(fieldNames.ownerBirthDate)
              : undefined
          }
        >
          {ownerBirthDate}
        </BaseFieldText>
        <BaseFieldText
          label='Sex'
          error={getError(fieldNames.ownerGender)}
          onClick={
            canHighlight ? handleFieldClick(fieldNames.ownerGender) : undefined
          }
        >
          {ownerGender}
        </BaseFieldText>
        <BaseFieldText
          label='Civil Status'
          error={getError(fieldNames.ownerCivilStatus)}
          onClick={
            canHighlight
              ? handleFieldClick(fieldNames.ownerCivilStatus)
              : undefined
          }
        >
          {ownerCivilStatus}
        </BaseFieldText>
        <BaseFieldText
          label='Religion'
          error={getError(fieldNames.ownerReligion)}
          onClick={
            canHighlight
              ? handleFieldClick(fieldNames.ownerReligion)
              : undefined
          }
        >
          {ownerReligion}
        </BaseFieldText>
        <BaseFieldText
          label='Address'
          error={getError(fieldNames.ownerAddress)}
          onClick={
            canHighlight ? handleFieldClick(fieldNames.ownerAddress) : undefined
          }
        >
          {ownerAddress}
        </BaseFieldText>
        <BaseFieldText
          label='Phone Number'
          error={getError(fieldNames.ownerPhoneNumber)}
          onClick={
            canHighlight
              ? handleFieldClick(fieldNames.ownerPhoneNumber)
              : undefined
          }
        >
          {ownerPhoneNumber}
        </BaseFieldText>
        <BaseFieldText
          label={`Driver's License`}
          error={getError(fieldNames.ownerLicenseNo)}
          onClick={
            canHighlight
              ? handleFieldClick(fieldNames.ownerLicenseNo)
              : undefined
          }
        >
          {ownerLicenseNo}
        </BaseFieldText>
        <BaseFieldText
          label='Email'
          error={getError(fieldNames.ownerEmail)}
          onClick={
            canHighlight ? handleFieldClick(fieldNames.ownerEmail) : undefined
          }
        >
          {ownerEmail}
        </BaseFieldText>
      </div>
    </div>
  );
});
