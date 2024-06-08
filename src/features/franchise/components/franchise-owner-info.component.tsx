import { memo, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { capitalize } from '#/core/helpers/string.helper';

import type { ComponentProps } from 'react';
import type { Franchise } from '../models/franchise.model';
import { BaseFieldText } from '#/base/components/base-field-text.component';

type Props = ComponentProps<'div'> & {
  franchise: Franchise;
};

export const FranchiseOwnerInfo = memo(function ({
  className,
  franchise,
  ...moreProps
}: Props) {
  const [
    ownerReverseFullName,
    ownerBirthDate,
    ownerGender,
    ownerPhoneNumber,
    ownerDriverLicenseNo,
  ] = useMemo(
    () => [
      franchise.user?.userProfile.reverseFullName || '',
      dayjs(franchise.user?.userProfile.birthDate || '').format('MMM DD, YYYY'),
      capitalize(franchise.user?.userProfile.gender || ''),
      franchise.user?.userProfile.phoneNumber || '',
      franchise.ownerDriverLicenseNo,
    ],
    [franchise],
  );

  return (
    <div
      className={cx('flex w-full flex-1 flex-col gap-4', className)}
      {...moreProps}
    >
      <h4>Owner Info</h4>
      <div className='grid w-full grid-cols-3 gap-4'>
        <BaseFieldText label='Name'>{ownerReverseFullName}</BaseFieldText>
        <BaseFieldText label='Date of Birth'>{ownerBirthDate}</BaseFieldText>
        <BaseFieldText label='Gender'>{ownerGender}</BaseFieldText>
        <BaseFieldText label='Phone Number'>{ownerPhoneNumber}</BaseFieldText>
        <BaseFieldText label={`Driver's License`}>
          {ownerDriverLicenseNo}
        </BaseFieldText>
      </div>
    </div>
  );
});
