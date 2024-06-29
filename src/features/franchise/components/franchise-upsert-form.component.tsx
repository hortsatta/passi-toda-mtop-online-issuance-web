import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import isBase64 from 'validator/lib/isBase64';
import { isMobilePhone } from 'validator';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { baseMemberRoute, routeConfig } from '#/config/routes.config';
import { capitalize } from '#/core/helpers/string.helper';
import { getErrorMessage } from '#/core/helpers/core.helper';
import {
  genderSelectOptions,
  civilStatusSelectOptions,
} from '#/user/helpers/user-helper';
import { UserCivilStatus, UserGender } from '#/user/models/user.model';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseButton } from '#/base/components/base-button.component';
import { BaseButtonIcon } from '#/base/components/base-button-icon.component';
import {
  BaseControlledInput,
  BaseInput,
} from '#/base/components/base-input.component';
import { BaseControlledInputDate } from '#/base/components/base-input-date.component';
import { BaseControlledInputUploaderImage } from '#/base/components/base-input-uploader-img.component';
import {
  BaseControlledInputSelect,
  BaseInputSelect,
} from '#/base/components/base-input-select.component';
import { driverProfileSelectOptions as defaultDriverProfileSelectOptions } from '../helpers/franchise-form.helper';

import type { ChangeEvent } from 'react';
import type { FieldErrors } from 'react-hook-form';
import type { FormProps, SelectItem } from '#/base/models/base.model';
import type { User } from '#/user/models/user.model';
import type { Franchise } from '../models/franchise.model';
import type { FranchiseUpsertFormData } from '../models/franchise-form-data.model';
import type { DriverProfile } from '#/user/models/driver-profile.model';
import type { DriverProfileUpsertFormData } from '#/user/models/driver-profile-form-data.model';

type Props = FormProps<'div', FranchiseUpsertFormData, Promise<Franchise>> & {
  user: User;
  todaAssociationSelectOptions: SelectItem[];
  driverProfiles: DriverProfile[];
  isFetching?: boolean;
};

const FRANCHISE_LIST_TO = `/${baseMemberRoute}/${routeConfig.franchise.to}`;

const driverProfileSchema = z.object({
  email: z.string().email('Provide your email address').optional(),
  firstName: z.string().min(2, 'Name is too short').max(50, 'Name is too long'),
  lastName: z.string().min(2, 'Name is too short').max(50, 'Name is too long'),
  middleName: z
    .string()
    .min(1, 'Name is too short')
    .max(50, 'Name is too long')
    .optional(),
  birthDate: z
    .date({ required_error: 'Provide your date of birth' })
    .min(new Date('1900-01-01'), 'Date of birth is too old')
    .max(new Date(), 'Date of birth is too young'),
  phoneNumber: z
    .string()
    .refine((value) => isMobilePhone(value.replace(/[^0-9]/g, ''), 'en-PH'), {
      message: 'Phone number is invalid',
    }),
  gender: z.nativeEnum(UserGender, {
    required_error: 'Provide your gender',
  }),
  civilStatus: z.nativeEnum(UserCivilStatus, {
    required_error: 'Provide your gender',
  }),
  religion: z
    .string()
    .min(2, 'Religion name is too short')
    .max(255, 'Religion name is too long'),
  address: z.string(),
  driverLicenseNo: z.string().length(11, `Invalid driver's license`),
});

const schema = z
  .object({
    mvFileNo: z.string().length(15, 'Invalid MV file number'),
    plateNo: z
      .string()
      .min(3, 'Invalid plate number')
      .max(7, 'Invalid plate number'),
    vehicleORImgUrl: z
      .string()
      .refine(
        (value) => isBase64(value.split(',').pop() || ''),
        'Invalid Vehicle OR',
      ),
    vehicleCRImgUrl: z
      .string()
      .refine(
        (value) => isBase64(value.split(',').pop() || ''),
        'Invalid Vehicle CR',
      ),
    todaAssocMembershipImgUrl: z
      .string()
      .refine(
        (value) => isBase64(value.split(',').pop() || ''),
        'Invalid TODA Membership',
      ),
    driverLicenseNoImgUrl: z
      .string()
      .refine(
        (value) => isBase64(value.split(',').pop() || ''),
        `Invalid Driver's License.`,
      ),
    brgyClearanceImgUrl: z
      .string()
      .refine(
        (value) => isBase64(value.split(',').pop() || ''),
        'Invalid Barangay Clearance',
      ),
    todaAssociationId: z
      .number({
        message: 'Select TODA association',
      })
      .int()
      .gt(0),
    driverProfileId: z
      .number({
        message: 'Select TODA association',
      })
      .int()
      .gt(0)
      .optional(),
    isDriverOwner: z.boolean(),
    driverProfile: driverProfileSchema.optional(),
    voterRegRecordImgUrl: z
      .string()
      .refine((value) => isBase64(value.split(',').pop() || ''))
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.isDriverOwner && !data.driverProfileId && !data.driverProfile) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid driver',
        path: ['driverProfileId', 'driverProfile'],
      });
    }
  });

const driverProfileDefaultValues: Partial<DriverProfileUpsertFormData> = {
  firstName: '',
  lastName: '',
  middleName: '',
  birthDate: undefined,
  phoneNumber: '',
  gender: undefined,
  civilStatus: undefined,
  religion: '',
  address: '',
  driverLicenseNo: '',
  email: '',
};

const defaultValues: Partial<FranchiseUpsertFormData> = {
  mvFileNo: '',
  plateNo: '',
  vehicleORImgUrl: undefined,
  vehicleCRImgUrl: undefined,
  todaAssocMembershipImgUrl: undefined,
  driverLicenseNoImgUrl: undefined,
  brgyClearanceImgUrl: undefined,
  todaAssociationId: undefined,
  driverProfileId: undefined,
  isDriverOwner: false,
  voterRegRecordImgUrl: undefined,
  driverProfile: driverProfileDefaultValues,
  userDriverLicenseNo: undefined,
};

export const FranchiseUpsertForm = memo(function ({
  className,
  formData,
  loading: formLoading,
  user: { email: userEmail, userProfile },
  todaAssociationSelectOptions,
  driverProfiles,
  isFetching,
  isDone,
  onDone,
  onSubmit,
  onDelete,
  ...moreProps
}: Props) {
  const navigate = useNavigate();

  const setFranchiseFormData = useBoundStore(
    (state) => state.setFranchiseFormData,
  );

  const [selectedDriverInfoValue, setSelectedDriverInfoValue] = useState<
    string | number | undefined
  >(undefined);

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    setValue,
    reset,
  } = useForm<FranchiseUpsertFormData>({
    shouldFocusError: false,
    defaultValues: formData || defaultValues,
    resolver: zodResolver(schema),
  });

  const isDriverOwner = useWatch({ control, name: 'isDriverOwner' });

  const loading = useMemo(
    () => formLoading || isSubmitting || isDone,
    [formLoading, isSubmitting, isDone],
  );

  const driverProfileSelectOptions = useMemo(() => {
    const options = driverProfiles.map((driverProfile) => ({
      label: driverProfile.reverseFullName,
      value: driverProfile.id,
    }));

    return [...defaultDriverProfileSelectOptions, ...options];
  }, [driverProfiles]);

  const handleSelectedDriverInfoValue = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const { value } = event.target;
      setSelectedDriverInfoValue(value);

      if (value === 'driver-owner') {
        const driverProfile: DriverProfileUpsertFormData = {
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          middleName: userProfile.middleName,
          birthDate: userProfile.birthDate,
          phoneNumber: userProfile.phoneNumber,
          gender: userProfile.gender,
          civilStatus: userProfile.civilStatus,
          religion: userProfile.religion,
          address: userProfile.address,
          driverLicenseNo: userProfile.driverLicenseNo,
          email: userEmail,
        };

        setValue('isDriverOwner', true);
        setValue('driverProfileId', undefined);
        setValue('driverProfile', driverProfile);
      } else if (value === 'add-new') {
        setValue('driverProfile', driverProfileDefaultValues);
        setValue('driverProfileId', undefined);
        setValue('isDriverOwner', false);
      } else if (!isNaN(+value)) {
        const driverProfile = driverProfiles.find(
          (driverProfile) => driverProfile.id === +value,
        );

        if (!driverProfile) return;

        const targetDriverProfile: DriverProfileUpsertFormData = {
          firstName: driverProfile.firstName,
          lastName: driverProfile.lastName,
          middleName: driverProfile.middleName,
          birthDate: driverProfile.birthDate,
          phoneNumber: driverProfile.phoneNumber,
          gender: driverProfile.gender,
          civilStatus: driverProfile.civilStatus,
          religion: driverProfile.religion,
          address: driverProfile.address,
          driverLicenseNo: driverProfile.driverLicenseNo,
          email: driverProfile?.email,
        };

        setValue('driverProfileId', +value);
        setValue('driverProfile', targetDriverProfile);
        setValue('isDriverOwner', false);
      }
    },
    [userEmail, userProfile, driverProfiles, setValue],
  );

  const handleReset = useCallback(() => {
    reset(formData ?? defaultValues);
  }, [formData, reset]);

  const handleSubmitError = useCallback(
    (errors: FieldErrors<FranchiseUpsertFormData>) => {
      const errorMessage = getErrorMessage(errors);
      toast.error(errorMessage || '');
    },
    [],
  );

  const submitForm = useCallback(
    async (data: FranchiseUpsertFormData) => {
      try {
        await onSubmit(data);
        const successText = `Registration ${formData ? 'updated' : 'submitted'}`;

        toast.success(successText);
        onDone && onDone(true);
        navigate(FRANCHISE_LIST_TO);
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [formData, onSubmit, onDone, navigate],
  );

  useEffect(() => {
    return () => {
      setFranchiseFormData();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={cx(
        'w-full rounded bg-backdrop-surface px-16 py-12',
        className,
      )}
      {...moreProps}
    >
      <form
        className='flex flex-col gap-10'
        onSubmit={handleSubmit(submitForm, handleSubmitError)}
      >
        <fieldset className='flex flex-col gap-6' disabled={loading}>
          <div className='flex flex-col gap-4'>
            <h4>Vehicle Info</h4>
            <div className='flex w-full flex-1 gap-2.5'>
              <BaseControlledInput
                label='MV File No'
                name='mvFileNo'
                control={control}
                fullWidth
                asterisk
              />
              <BaseControlledInput
                label='Plate No'
                name='plateNo'
                control={control}
                fullWidth
                asterisk
              />
              <BaseControlledInputSelect
                label='TODA Association'
                name='todaAssociationId'
                control={control}
                items={todaAssociationSelectOptions}
                disabled={isFetching}
                fullWidth
                asterisk
                isNumber
              />
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            <h4>Documents</h4>
            <div className='flex w-full flex-col gap-2.5'>
              <div className='grid grid-cols-3 gap-2.5'>
                <BaseControlledInputUploaderImage
                  label='Vehicle Official Receipt (OR)'
                  name='vehicleORImgUrl'
                  control={control}
                  hideErrorMessage
                  fullWidth
                  asterisk
                  lg
                />
                <BaseControlledInputUploaderImage
                  label='Vehicle Certificate of Registration (CR)'
                  name='vehicleCRImgUrl'
                  control={control}
                  hideErrorMessage
                  fullWidth
                  asterisk
                  lg
                />
                <BaseControlledInputUploaderImage
                  label='TODA Association Membership'
                  name='todaAssocMembershipImgUrl'
                  control={control}
                  hideErrorMessage
                  fullWidth
                  asterisk
                  lg
                />
                <BaseControlledInputUploaderImage
                  label={`Driver's License`}
                  name='driverLicenseNoImgUrl'
                  control={control}
                  hideErrorMessage
                  fullWidth
                  asterisk
                  lg
                />
                <BaseControlledInputUploaderImage
                  label='Barangay Clearance'
                  name='brgyClearanceImgUrl'
                  control={control}
                  hideErrorMessage
                  fullWidth
                  asterisk
                  lg
                />
                <BaseControlledInputUploaderImage
                  label={`Voter's Registration Record`}
                  name='voterRegRecordImgUrl'
                  control={control}
                  hideErrorMessage
                  fullWidth
                  lg
                />
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-4 pt-2.5'>
            <div className='flex items-center justify-between'>
              <h4>Driver Info</h4>
              <div className='w-full max-w-[330px]'>
                <BaseInputSelect
                  label='Select Driver'
                  items={driverProfileSelectOptions}
                  value={selectedDriverInfoValue}
                  onChange={handleSelectedDriverInfoValue}
                  disabled={isFetching}
                  fullWidth
                  asterisk
                />
              </div>
            </div>
            {selectedDriverInfoValue !== 'driver-owner' &&
              selectedDriverInfoValue !== undefined && (
                <div className='flex flex-col gap-2.5'>
                  <div className='grid grid-cols-3 gap-2.5'>
                    <BaseControlledInput
                      name='driverProfile.firstName'
                      label='First Name'
                      control={control}
                      disabled={isFetching}
                      fullWidth
                      asterisk
                    />
                    <BaseControlledInput
                      name='driverProfile.lastName'
                      label='Last Name'
                      control={control}
                      disabled={isFetching}
                      fullWidth
                      asterisk
                    />
                    <BaseControlledInput
                      name='driverProfile.middleName'
                      label='Middle Name'
                      control={control}
                      disabled={isFetching}
                      fullWidth
                    />
                    <BaseControlledInputDate
                      name='driverProfile.birthDate'
                      label='Date of Birth'
                      control={control}
                      disabled={isFetching}
                      fullWidth
                      asterisk
                    />
                    <BaseControlledInputSelect
                      name='driverProfile.gender'
                      label='Gender'
                      items={genderSelectOptions}
                      control={control}
                      disabled={isFetching}
                      fullWidth
                      asterisk
                    />
                    <BaseControlledInputSelect
                      name='driverProfile.civilStatus'
                      label='Civil Status'
                      items={civilStatusSelectOptions}
                      control={control}
                      disabled={isFetching}
                      fullWidth
                      asterisk
                    />
                    <BaseControlledInput
                      name='driverProfile.religion'
                      label='Religion'
                      control={control}
                      disabled={isFetching}
                      fullWidth
                      asterisk
                    />
                    <BaseControlledInput
                      name='driverProfile.phoneNumber'
                      label='Phone'
                      control={control}
                      disabled={isFetching}
                      fullWidth
                      asterisk
                    />
                    <BaseControlledInput
                      name='driverProfile.address'
                      label='Address'
                      control={control}
                      disabled={isFetching}
                      fullWidth
                      asterisk
                    />
                    <BaseControlledInput
                      type='email'
                      name='driverProfile.email'
                      label='Email'
                      control={control}
                      disabled={isFetching}
                      fullWidth
                    />
                    <BaseControlledInput
                      name='driverProfile.driverLicenseNo'
                      label={`Driver's License No`}
                      control={control}
                      disabled={isFetching}
                      fullWidth
                      asterisk
                    />
                  </div>
                </div>
              )}
          </div>
          <div className='flex flex-col gap-4'>
            <h4>Owner Info</h4>
            <div className='flex flex-col gap-2.5'>
              <div className='grid grid-cols-3 gap-2.5'>
                <BaseInput
                  value={userProfile.firstName}
                  label='First Name'
                  fullWidth
                  disabled
                />
                <BaseInput
                  value={userProfile.lastName}
                  label='Last Name'
                  fullWidth
                  disabled
                />
                <BaseInput
                  value={userProfile.middleName}
                  label='Middle Name'
                  fullWidth
                  disabled
                />
                <BaseInput
                  value={dayjs(userProfile.birthDate).format('YYYY-MM-DD')}
                  label='Date of Birth'
                  fullWidth
                  disabled
                />
                <BaseInput
                  value={capitalize(userProfile.gender)}
                  label='Gender'
                  fullWidth
                  disabled
                />
                <BaseInput
                  value={capitalize(userProfile.civilStatus)}
                  label='Civil Status'
                  fullWidth
                  disabled
                />
                <BaseInput
                  value={userProfile.religion}
                  label='Religion'
                  fullWidth
                  disabled
                />
                <BaseInput
                  value={userProfile.phoneNumber}
                  label='Phone'
                  fullWidth
                  disabled
                />
                <BaseInput
                  value={userProfile.address}
                  label='Address'
                  fullWidth
                  disabled
                />
                <BaseInput value={userEmail} label='Email' fullWidth disabled />
                {isDriverOwner && !userProfile.driverLicenseNo?.length ? (
                  <BaseControlledInput
                    name='driverProfile.driverLicenseNo'
                    label={`Driver's License No`}
                    control={control}
                    disabled={isFetching}
                    fullWidth
                    asterisk
                  />
                ) : (
                  <BaseInput
                    value={userProfile.driverLicenseNo || ''}
                    label={`Driver's License No`}
                    fullWidth
                    disabled
                  />
                )}
              </div>
            </div>
          </div>
        </fieldset>
        <div className='w-full border-b border-border' />
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-4'>
            {onDelete && (
              <BaseButtonIcon
                iconName='trash'
                loading={loading}
                variant='warn'
                disabled={isDone || isFetching}
                onClick={onDelete}
              />
            )}
            <BaseButtonIcon
              iconName='arrow-counter-clockwise'
              loading={loading}
              disabled={isDone || isFetching}
              onClick={handleReset}
            />
          </div>
          <BaseButton
            className='min-w-[200px] px-10 !text-base'
            type='submit'
            loading={loading}
            disabled={isDone || isFetching}
          >
            {formData ? 'Save Changes' : 'Register'}
          </BaseButton>
        </div>
      </form>
    </div>
  );
});
