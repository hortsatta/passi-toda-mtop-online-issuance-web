import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import {
  queryFranchiseKey,
  queryUserKey,
} from '#/config/react-query-keys.config';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { editUser as editUserApi } from '#/user/api/user.api';
import {
  createFranchise as createFranchiseApi,
  validateUpsertFranchise as validateUpsertFranchiseApi,
  uploadFranchiseFiles as uploadFranchiseFilesApi,
} from '../api/franchise.api';

import type { UserUpdateFormData } from '#/user/models/user-form-data.model';
import type { FranchiseUpsertFormData } from '../models/franchise-form-data.model';
import type { Franchise } from '../models/franchise.model';

type Result = {
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  createFranchise: (data: FranchiseUpsertFormData) => Promise<Franchise>;
  loading?: boolean;
};

export function useFranchiseCreate(): Result {
  const userProfile = useBoundStore((state) => state.user?.userProfile);
  const [isDone, setIsDone] = useState(false);

  const {
    mutateAsync: validateUpsertFranchise,
    isPending: isValidateFranchisePending,
  } = useMutation(validateUpsertFranchiseApi());

  const {
    mutateAsync: mutateUploadFranchiseFiles,
    isPending: isUploadFilesPending,
  } = useMutation(uploadFranchiseFilesApi());

  const {
    mutateAsync: mutateCreateFranchise,
    isPending: isCreateFranchisePending,
  } = useMutation(
    createFranchiseApi({
      onSuccess: () =>
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: queryFranchiseKey.list,
          }),
          queryClient.invalidateQueries({
            queryKey: queryFranchiseKey.digestList,
          }),
          queryClient.invalidateQueries({
            queryKey: queryFranchiseKey.checkSingle,
          }),
        ]),
    }),
  );

  const { mutateAsync: mutateEditUser, isPending: isEditUserPending } =
    useMutation(
      editUserApi({
        onSuccess: () =>
          queryClient.invalidateQueries({
            queryKey: queryUserKey.currentUser,
          }),
      }),
    );

  const createFranchise = useCallback(
    async (data: FranchiseUpsertFormData) => {
      const hasImages = [
        data.vehicleCRImgUrl,
        data.vehicleORImgUrl,
        data.todaAssocMembershipImgUrl,
        data.driverLicenseNoImgUrl,
        data.brgyClearanceImgUrl,
        data.voterRegRecordImgUrl,
      ].some(
        (imageData) =>
          !!(typeof imageData === 'string' ? imageData?.trim() : imageData),
      );

      await validateUpsertFranchise({ data });

      if (
        data.isDriverOwner &&
        userProfile?.driverLicenseNo !== data.driverProfile?.driverLicenseNo
      ) {
        await mutateEditUser({
          driverLicenseNo: data.driverProfile?.driverLicenseNo,
        } as UserUpdateFormData);
      }

      if (!hasImages) {
        return mutateCreateFranchise(data);
      } else {
        const imageResult = await mutateUploadFranchiseFiles(data);
        return mutateCreateFranchise({ ...data, ...imageResult });
      }
    },
    [
      userProfile,
      validateUpsertFranchise,
      mutateCreateFranchise,
      mutateUploadFranchiseFiles,
      mutateEditUser,
    ],
  );

  return {
    loading:
      isValidateFranchisePending ||
      isUploadFilesPending ||
      isCreateFranchisePending ||
      isEditUserPending,
    isDone,
    setIsDone,
    createFranchise,
  };
}
