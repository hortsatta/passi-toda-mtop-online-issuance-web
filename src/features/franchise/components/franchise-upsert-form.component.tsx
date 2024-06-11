import { memo, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import isBase64 from 'validator/lib/isBase64';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { baseMemberRoute, routeConfig } from '#/config/routes.config';
import { capitalize } from '#/core/helpers/string.helper';
import { getErrorMessage } from '#/core/helpers/core.helper';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseButton } from '#/base/components/base-button.component';
import { BaseButtonIcon } from '#/base/components/base-button-icon.component';
import {
  BaseControlledInput,
  BaseInput,
} from '#/base/components/base-input.component';
import { BaseControlledInputUploaderImage } from '#/base/components/base-input-uploader-img.component';
import { BaseControlledInputSelect } from '#/base/components/base-input-select.component';

import type { FieldErrors } from 'react-hook-form';
import type { FormProps, SelectItem } from '#/base/models/base.model';
import type { UserProfile } from '#/user/models/user.model';
import type { Franchise } from '../models/franchise.model';
import type { FranchiseUpsertFormData } from '../models/franchise-form-data.model';

type Props = FormProps<'div', FranchiseUpsertFormData, Promise<Franchise>> & {
  userProfile: UserProfile;
  todaAssociationSelectItems: SelectItem[];
  isTodaAssociationFetching?: boolean;
};

const FRANCHISE_LIST_PATH = `/${baseMemberRoute}/${routeConfig.franchise.to}`;

const schema = z.object({
  mvFileNo: z.string().length(15, 'Invalid MV file number'),
  plateNo: z
    .string()
    .min(3, 'Invalid plate number')
    .max(7, 'Invalid plate number'),
  ownerDriverLicenseNo: z.string().length(11, `Invalid Driver's License No.`),
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
  ownerDriverLicenseNoImgUrl: z
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
  voterRegRecordImgUrl: z
    .string()
    .refine((value) => isBase64(value.split(',').pop() || ''))
    .optional(),
});

const defaultValues: Partial<FranchiseUpsertFormData> = {
  mvFileNo: '',
  plateNo: '',
  ownerDriverLicenseNo: '',
  vehicleORImgUrl: undefined,
  vehicleCRImgUrl: undefined,
  todaAssocMembershipImgUrl: undefined,
  ownerDriverLicenseNoImgUrl: undefined,
  brgyClearanceImgUrl: '',
  todaAssociationId: undefined,
  voterRegRecordImgUrl: undefined,
};

export const FranchiseUpsertForm = memo(function ({
  className,
  formData,
  loading: formLoading,
  userProfile,
  todaAssociationSelectItems,
  isTodaAssociationFetching,
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

  const transformedDefaultValues = useMemo(
    () => ({
      ...defaultValues,
      ...{ ownerDriverLicenseNo: userProfile.driverLicenseNo },
    }),
    [userProfile],
  );

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = useForm<FranchiseUpsertFormData>({
    shouldFocusError: false,
    defaultValues: formData || transformedDefaultValues,
    resolver: zodResolver(schema),
  });

  const loading = useMemo(
    () => formLoading || isSubmitting || isDone,
    [formLoading, isSubmitting, isDone],
  );

  const handleReset = useCallback(() => {
    reset(formData ?? transformedDefaultValues);
  }, [formData, transformedDefaultValues, reset]);

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
        navigate(FRANCHISE_LIST_PATH);
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
                items={todaAssociationSelectItems}
                disabled={isTodaAssociationFetching}
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
                  name='ownerDriverLicenseNoImgUrl'
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
              <div className='grid grid-cols-3 gap-2.5'>
                <BaseControlledInput
                  label={`Driver's License No`}
                  name='ownerDriverLicenseNo'
                  control={control}
                  fullWidth
                  asterisk
                />
              </div>
            </div>
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
                  value={userProfile.phoneNumber}
                  label='Phone'
                  fullWidth
                  disabled
                />
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
                disabled={isDone || isTodaAssociationFetching}
                onClick={onDelete}
              />
            )}
            <BaseButtonIcon
              iconName='arrow-counter-clockwise'
              loading={loading}
              disabled={isDone || isTodaAssociationFetching}
              onClick={handleReset}
            />
          </div>
          <BaseButton
            className='min-w-[200px] px-10 !text-base'
            type='submit'
            loading={loading}
            disabled={isDone || isTodaAssociationFetching}
          >
            {formData ? 'Save Changes' : 'Register'}
          </BaseButton>
        </div>
      </form>
    </div>
  );
});
