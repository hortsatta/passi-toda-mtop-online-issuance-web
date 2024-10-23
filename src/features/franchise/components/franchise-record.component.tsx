import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { capitalize } from '#/core/helpers/string.helper';
import { BaseFieldImg } from '#/base/components/base-field-img.component';
import { BaseFieldText } from '#/base/components/base-field-text.component';
import { UserCivilStatus } from '#/user/models/user.model';
import { fieldNames } from '../config/franchise.config';

import type { ComponentProps, Dispatch, SetStateAction } from 'react';
import type { Franchise } from '../models/franchise.model';
import type { FranchiseStatusFieldError } from '../models/franchise-status-remark.model';

type CurrentImg = {
  src: string | null;
  title?: string;
};

type Props = ComponentProps<'div'> & {
  franchise: Franchise;
  setCurrentImg: (value: CurrentImg) => void;
  fieldErrors?: FranchiseStatusFieldError[];
  canHighlight?: boolean;
  setFieldErrors?: Dispatch<SetStateAction<FranchiseStatusFieldError[]>>;
};

export const FranchiseRecord = memo(function ({
  className,
  franchise,
  fieldErrors,
  canHighlight,
  setCurrentImg,
  setFieldErrors,
  ...moreProps
}: Props) {
  const [mvFileNo, vehicleMake, vehicleMotorNo, vehicleChassisNo, plateNo] =
    useMemo(
      () => [
        franchise.mvFileNo.toUpperCase(),
        franchise.vehicleMake.toUpperCase(),
        franchise.vehicleMotorNo.toUpperCase(),
        franchise.vehicleChassisNo.toUpperCase(),
        franchise.plateNo.toUpperCase(),
      ],
      [franchise],
    );

  const [
    statusFieldRemarks,
    todaAssociationName,
    vehicleORImgUrl,
    vehicleCRImgUrl,
    todaAssocMembershipImgUrl,
    driverLicenseNoImgUrl,
    brgyClearanceImgUrl,
    ctcCedulaImgUrl,
    voterRegRecordImgUrl,
    driverInfoText,
    driverProfile,
  ] = useMemo(() => {
    const target = franchise.franchiseRenewals.length
      ? franchise.franchiseRenewals[0]
      : franchise;

    return [
      target.franchiseStatusRemarks?.filter((sr) => sr.fieldName?.length) || [],
      target.todaAssociation.name,
      target.vehicleORImgUrl,
      target.vehicleCRImgUrl,
      target.todaAssocMembershipImgUrl,
      target.driverLicenseNoImgUrl,
      target.brgyClearanceImgUrl,
      target.ctcCedulaImgUrl,
      target.voterRegRecordImgUrl,
      target.isDriverOwner ? 'Owner and Driver Info' : 'Driver Info',
      target.isDriverOwner
        ? { ...franchise.user?.userProfile, email: franchise.user?.email || '' }
        : target.driverProfile,
    ];
  }, [franchise]);

  const [
    driverReverseFullName,
    driverBirthDate,
    driverAge,
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
      driverProfile?.birthDate
        ? dayjs().diff(dayjs(driverProfile.birthDate), 'y')
        : null,
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

  const getError = useCallback(
    (fieldError: FranchiseStatusFieldError) =>
      canHighlight
        ? fieldErrors?.some((fe) => fe.name === fieldError.name)
        : statusFieldRemarks.some((sr) => sr.fieldName === fieldError.name),
    [canHighlight, fieldErrors, statusFieldRemarks],
  );

  const handleImgClick = useCallback(
    (src: string | null, title = '') =>
      () => {
        setCurrentImg({ src, title });
      },
    [setCurrentImg],
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
      className={cx('flex w-full flex-1 flex-col items-start gap-6', className)}
      {...moreProps}
    >
      <div className='flex w-full flex-1 flex-col gap-4'>
        <h4>Vehicle Info</h4>
        <div className='grid grid-cols-3 gap-4'>
          <BaseFieldText
            label='MV File No'
            error={getError(fieldNames.mvFileNo)}
            onClick={
              canHighlight ? handleFieldClick(fieldNames.mvFileNo) : undefined
            }
          >
            {mvFileNo}
          </BaseFieldText>
          <BaseFieldText
            className='order-4'
            label='Vehicle Make'
            error={getError(fieldNames.vehicleMake)}
            onClick={
              canHighlight
                ? handleFieldClick(fieldNames.vehicleMake)
                : undefined
            }
          >
            {vehicleMake}
          </BaseFieldText>
          <BaseFieldText
            className='order-5'
            label='Vehicle Motor No'
            error={getError(fieldNames.vehicleMotorNo)}
            onClick={
              canHighlight
                ? handleFieldClick(fieldNames.vehicleMotorNo)
                : undefined
            }
          >
            {vehicleMotorNo}
          </BaseFieldText>
          <BaseFieldText
            className='order-6'
            label='Vehicle Chassis No'
            error={getError(fieldNames.vehicleChassisNo)}
            onClick={
              canHighlight
                ? handleFieldClick(fieldNames.vehicleChassisNo)
                : undefined
            }
          >
            {vehicleChassisNo}
          </BaseFieldText>
          <BaseFieldText
            label='Plate No'
            error={getError(fieldNames.plateNo)}
            onClick={
              canHighlight ? handleFieldClick(fieldNames.plateNo) : undefined
            }
          >
            {plateNo}
          </BaseFieldText>
          <BaseFieldText
            label='TODA Association'
            error={getError(fieldNames.todaAssociation)}
            onClick={
              canHighlight
                ? handleFieldClick(fieldNames.todaAssociation)
                : undefined
            }
          >
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
            error={getError(fieldNames.vehicleORImgUrl)}
            onClick={handleImgClick(
              vehicleORImgUrl,
              'Vehicle Official Receipt (OR)',
            )}
            onWrapperClick={
              canHighlight
                ? handleFieldClick(fieldNames.vehicleORImgUrl)
                : undefined
            }
          />
          <BaseFieldImg
            src={vehicleCRImgUrl}
            label='Vehicle Certificate of Registration (CR)'
            error={getError(fieldNames.vehicleCRImgUrl)}
            onClick={handleImgClick(
              vehicleCRImgUrl,
              'Vehicle Certificate of Registration (CR)',
            )}
            onWrapperClick={
              canHighlight
                ? handleFieldClick(fieldNames.vehicleCRImgUrl)
                : undefined
            }
          />
          <BaseFieldImg
            src={todaAssocMembershipImgUrl}
            label='TODA Association Membership'
            error={getError(fieldNames.todaAssocMembershipImgUrl)}
            onClick={handleImgClick(
              todaAssocMembershipImgUrl,
              'TODA Association Membership',
            )}
            onWrapperClick={
              canHighlight
                ? handleFieldClick(fieldNames.todaAssocMembershipImgUrl)
                : undefined
            }
          />
        </div>
        <div className='grid grid-cols-3 gap-4'>
          <BaseFieldImg
            src={driverLicenseNoImgUrl}
            label={`Driver's License No`}
            error={getError(fieldNames.driverLicenseNoImgUrl)}
            onClick={handleImgClick(
              driverLicenseNoImgUrl,
              `Driver's License No`,
            )}
            onWrapperClick={
              canHighlight
                ? handleFieldClick(fieldNames.driverLicenseNoImgUrl)
                : undefined
            }
          />
          <BaseFieldImg
            src={brgyClearanceImgUrl}
            label='Barangay Clearance'
            error={getError(fieldNames.brgyClearanceImgUrl)}
            onClick={handleImgClick(brgyClearanceImgUrl, 'Barangay Clearance')}
            onWrapperClick={
              canHighlight
                ? handleFieldClick(fieldNames.brgyClearanceImgUrl)
                : undefined
            }
          />
          <BaseFieldImg
            src={ctcCedulaImgUrl}
            label='CTC (Cedula)'
            error={getError(fieldNames.ctcCedulaImgUrl)}
            onClick={handleImgClick(ctcCedulaImgUrl, 'CTC (Cedula)')}
            onWrapperClick={
              canHighlight
                ? handleFieldClick(fieldNames.ctcCedulaImgUrlImgUrl)
                : undefined
            }
          />
          <BaseFieldImg
            src={voterRegRecordImgUrl}
            label={`Voter's Registration Record`}
            error={getError(fieldNames.voterRegRecordImgUrl)}
            onClick={handleImgClick(
              voterRegRecordImgUrl || null,
              `Voter's Registration Record`,
            )}
            onWrapperClick={
              canHighlight
                ? handleFieldClick(fieldNames.voterRegRecordImgUrl)
                : undefined
            }
          />
        </div>
      </div>
      <div className='flex w-full flex-1 flex-col gap-4'>
        <h4>{driverInfoText}</h4>
        <div className='grid w-full grid-cols-3 gap-4'>
          <BaseFieldText
            label='Name'
            error={getError(fieldNames.driverFullName)}
            onClick={
              canHighlight
                ? handleFieldClick(fieldNames.driverFullName)
                : undefined
            }
          >
            {driverReverseFullName}
          </BaseFieldText>
          <BaseFieldText
            label='Date of Birth'
            error={getError(fieldNames.driverBirthDate)}
            onClick={
              canHighlight
                ? handleFieldClick(fieldNames.driverBirthDate)
                : undefined
            }
          >
            {driverBirthDate}
          </BaseFieldText>
          {driverAge && (
            <BaseFieldText
              label='Age'
              error={getError(fieldNames.driverAge)}
              onClick={
                canHighlight
                  ? handleFieldClick(fieldNames.driverAge)
                  : undefined
              }
            >
              {driverAge}
            </BaseFieldText>
          )}
          <BaseFieldText
            label='Sex'
            error={getError(fieldNames.driverGender)}
            onClick={
              canHighlight
                ? handleFieldClick(fieldNames.driverGender)
                : undefined
            }
          >
            {driverGender}
          </BaseFieldText>
          <BaseFieldText
            label='Civil Status'
            error={getError(fieldNames.driverCivilStatus)}
            onClick={
              canHighlight
                ? handleFieldClick(fieldNames.driverCivilStatus)
                : undefined
            }
          >
            {driverCivilStatus}
          </BaseFieldText>
          <BaseFieldText
            label='Religion'
            error={getError(fieldNames.driverReligion)}
            onClick={
              canHighlight
                ? handleFieldClick(fieldNames.driverReligion)
                : undefined
            }
          >
            {driverReligion}
          </BaseFieldText>
          <BaseFieldText
            label='Address'
            error={getError(fieldNames.driverAddress)}
            onClick={
              canHighlight
                ? handleFieldClick(fieldNames.driverAddress)
                : undefined
            }
          >
            {driverAddress}
          </BaseFieldText>
          <BaseFieldText
            label='Phone Number'
            error={getError(fieldNames.driverPhoneNumber)}
            onClick={
              canHighlight
                ? handleFieldClick(fieldNames.driverPhoneNumber)
                : undefined
            }
          >
            {driverPhoneNumber}
          </BaseFieldText>
          <BaseFieldText
            label={`Driver's License`}
            error={getError(fieldNames.driverLicenseNo)}
            onClick={
              canHighlight
                ? handleFieldClick(fieldNames.driverLicenseNo)
                : undefined
            }
          >
            {driverLicenseNo}
          </BaseFieldText>
          <BaseFieldText
            label='Email'
            error={getError(fieldNames.driverEmail)}
            onClick={
              canHighlight
                ? handleFieldClick(fieldNames.driverEmail)
                : undefined
            }
          >
            {driverEmail}
          </BaseFieldText>
        </div>
      </div>
    </div>
  );
});
