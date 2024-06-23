import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { capitalize } from '#/core/helpers/string.helper';
import { BaseFieldImg } from '#/base/components/base-field-img.component';
import { BaseFieldText } from '#/base/components/base-field-text.component';
import { UserCivilStatus } from '#/user/models/user.model';

import type { ComponentProps } from 'react';
import type { Franchise } from '../models/franchise.model';

type CurrentImg = {
  src: string | null;
  title?: string;
};

type Props = ComponentProps<'div'> & {
  franchise: Franchise;
  setCurrentImg: (value: CurrentImg) => void;
};

export const FranchiseRecord = memo(function ({
  className,
  franchise,
  setCurrentImg,
  ...moreProps
}: Props) {
  const [
    mvFileNo,
    plateNo,
    todaAssociationName,
    vehicleORImgUrl,
    vehicleCRImgUrl,
    todaAssocMembershipImgUrl,
    driverLicenseNoImgUrl,
    brgyClearanceImgUrl,
    voterRegRecordImgUrl,
    driverInfoText,
    driverProfile,
  ] = useMemo(
    () => [
      franchise.mvFileNo,
      franchise.plateNo,
      franchise.todaAssociation.name,
      franchise.vehicleORImgUrl,
      franchise.vehicleCRImgUrl,
      franchise.todaAssocMembershipImgUrl,
      franchise.driverLicenseNoImgUrl,
      franchise.brgyClearanceImgUrl,
      franchise.voterRegRecordImgUrl,
      franchise.isDriverOwner ? 'Owner and Driver Info' : 'Driver Info',
      franchise.isDriverOwner
        ? { ...franchise.user?.userProfile, email: franchise.user?.email || '' }
        : franchise.driverProfile,
    ],
    [franchise],
  );

  const [
    driverReverseFullName,
    driverBirthDate,
    driverGender,
    driverCivilStatus,
    driverReligion,
    driverAddress,
    driverPhoneNumber,
    driverLicenseNo,
    driverEmail,
  ] = useMemo(
    () => [
      driverProfile?.reverseFullName || '',
      dayjs(driverProfile?.birthDate || '').format('MMM DD, YYYY'),
      capitalize(driverProfile?.gender || ''),
      driverProfile?.civilStatus === UserCivilStatus.LegallySeparated
        ? 'Legally Separated'
        : capitalize(driverProfile?.civilStatus || ''),
      driverProfile?.religion || '',
      driverProfile?.address || '',
      driverProfile?.phoneNumber || '',
      driverProfile?.driverLicenseNo || '',
      driverProfile?.email || '',
    ],
    [driverProfile],
  );

  const handleImgClick = useCallback(
    (src: string | null, title = '') =>
      () => {
        setCurrentImg({ src, title });
      },
    [setCurrentImg],
  );

  return (
    <div
      className={cx('flex w-full flex-1 flex-col items-start gap-6', className)}
      {...moreProps}
    >
      <div className='flex w-full flex-1 flex-col gap-4'>
        <h4>Vehicle Info</h4>
        <div className='flex flex-1 gap-4'>
          <BaseFieldText label='Plate No'>{plateNo}</BaseFieldText>
          <BaseFieldText label='MV File No'>{mvFileNo}</BaseFieldText>
          <BaseFieldText label='TODA Association'>
            {todaAssociationName}
          </BaseFieldText>
        </div>
      </div>
      <div className='flex w-full flex-1 flex-col gap-4'>
        <h4>Documents</h4>
        <div className='grid grid-cols-3 gap-4'>
          <BaseFieldImg
            src={vehicleORImgUrl}
            label='Vehicle Official Receipt (OR)'
            onClick={handleImgClick(
              vehicleORImgUrl,
              'Vehicle Official Receipt (OR)',
            )}
          />
          <BaseFieldImg
            src={vehicleCRImgUrl}
            label='Vehicle Certificate of Registration (CR)'
            onClick={handleImgClick(
              vehicleCRImgUrl,
              'Vehicle Certificate of Registration (CR)',
            )}
          />
          <BaseFieldImg
            src={todaAssocMembershipImgUrl}
            label='TODA Association Membership'
            onClick={handleImgClick(
              todaAssocMembershipImgUrl,
              'TODA Association Membership',
            )}
          />
        </div>
        <div className='grid grid-cols-3 gap-4'>
          <BaseFieldImg
            src={driverLicenseNoImgUrl}
            label={`Driver's License No`}
            onClick={handleImgClick(
              driverLicenseNoImgUrl,
              `Driver's License No`,
            )}
          />
          <BaseFieldImg
            src={brgyClearanceImgUrl}
            label='Barangay Clearance'
            onClick={handleImgClick(brgyClearanceImgUrl, 'Barangay Clearance')}
          />
          <BaseFieldImg
            src={voterRegRecordImgUrl}
            label={`Voter's Registration Record`}
            onClick={handleImgClick(
              voterRegRecordImgUrl || null,
              `Voter's Registration Record`,
            )}
          />
        </div>
      </div>
      <div className='flex w-full flex-1 flex-col gap-4'>
        <h4>{driverInfoText}</h4>
        <div className='grid w-full grid-cols-3 gap-4'>
          <BaseFieldText label='Name'>{driverReverseFullName}</BaseFieldText>
          <BaseFieldText label='Date of Birth'>{driverBirthDate}</BaseFieldText>
          <BaseFieldText label='Gender'>{driverGender}</BaseFieldText>
          <BaseFieldText label='Civil Status'>
            {driverCivilStatus}
          </BaseFieldText>
          <BaseFieldText label='Religion'>{driverReligion}</BaseFieldText>
          <BaseFieldText label='Address'>{driverAddress}</BaseFieldText>
          <BaseFieldText label='Phone Number'>
            {driverPhoneNumber}
          </BaseFieldText>
          <BaseFieldText label={`Driver's License`}>
            {driverLicenseNo}
          </BaseFieldText>
          <BaseFieldText label='Email'>{driverEmail}</BaseFieldText>
        </div>
      </div>
    </div>
  );
});
