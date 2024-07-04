import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { baseMemberRoute, routeConfig } from '#/config/routes.config';
import { queryClient } from '#/config/react-query-client.config';
import {
  queryFranchiseKey,
  queryUserKey,
} from '#/config/react-query-keys.config';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { editUser as editUserApi } from '#/user/api/user.api';
import {
  createFranchiseRenewal as createFranchiseRenewalApi,
  validateUpsertFranchiseRenewal as validateUpsertFranchiseRenewalApi,
  uploadFranchiseRenewalFiles as uploadFranchiseRenewalFilesApi,
} from '../api/franchise-renewal.api';
import { useMemberFranchiseSingle } from './use-member-franchise-single.hook';

import type { UserUpdateFormData } from '#/user/models/user-form-data.model';
import type { Franchise } from '../models/franchise.model';
import type { FranchiseRenewalUpsertFormData } from '../models/franchise-renewal-form-data.model';
import type { FranchiseRenewal } from '../models/franchise-renewal.model';

type Result = {
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  createFranchiseRenewal: (
    data: FranchiseRenewalUpsertFormData,
  ) => Promise<FranchiseRenewal>;
  franchise?: Franchise;
  loading?: boolean;
  franchiseLoading?: boolean;
};

const FRANCHISE_LIST_TO = `/${baseMemberRoute}/${routeConfig.franchise.to}`;

export function useFranchiseRenewalCreate(): Result {
  const navigate = useNavigate();
  const userProfile = useBoundStore((state) => state.user?.userProfile);
  const { franchise, loading: franchiseLoading } = useMemberFranchiseSingle();
  const [isDone, setIsDone] = useState(false);

  const {
    mutateAsync: validateUpsertFranchiseRenewal,
    isPending: isValidateFranchiseRenewalPending,
  } = useMutation(validateUpsertFranchiseRenewalApi());

  const {
    mutateAsync: mutateUploadFranchiseRenewalFiles,
    isPending: isUploadFilesPending,
  } = useMutation(uploadFranchiseRenewalFilesApi());

  const {
    mutateAsync: mutateCreateFranchiseRenewal,
    isPending: isCreateFranchiseRenewalPending,
  } = useMutation(
    createFranchiseRenewalApi({
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

  const createFranchiseRenewal = useCallback(
    async (data: FranchiseRenewalUpsertFormData) => {
      if (!franchise) throw new Error('Invalid franchise');

      const hasImages = [
        data.vehicleCRImgUrl,
        data.vehicleORImgUrl,
        data.todaAssocMembershipImgUrl,
        data.driverLicenseNoImgUrl,
        data.brgyClearanceImgUrl,
        data.ctcCedulaImgUrl,
        data.voterRegRecordImgUrl,
      ].some(
        (imageData) =>
          !!(typeof imageData === 'string' ? imageData?.trim() : imageData),
      );

      if (
        data.isDriverOwner &&
        userProfile?.driverLicenseNo !== data.driverProfile?.driverLicenseNo
      ) {
        await mutateEditUser({
          driverLicenseNo: data.driverProfile?.driverLicenseNo,
        } as UserUpdateFormData);
      }

      await validateUpsertFranchiseRenewal({ data });

      if (!hasImages) {
        return mutateCreateFranchiseRenewal(data);
      } else {
        const imageResult = await mutateUploadFranchiseRenewalFiles({
          data,
          mvFileNo: franchise.mvFileNo,
        });
        return mutateCreateFranchiseRenewal({ ...data, ...imageResult });
      }
    },
    [
      userProfile,
      franchise,
      validateUpsertFranchiseRenewal,
      mutateCreateFranchiseRenewal,
      mutateUploadFranchiseRenewalFiles,
      mutateEditUser,
    ],
  );

  useEffect(() => {
    if (!franchise || franchise.canRenew) return;
    navigate(FRANCHISE_LIST_TO);
    toast.error('Franchise is not valid for renewal', { id: 'renew-error' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [franchise]);

  return {
    loading:
      isValidateFranchiseRenewalPending ||
      isUploadFilesPending ||
      isCreateFranchiseRenewalPending ||
      isEditUserPending,
    franchiseLoading,
    isDone,
    franchise,
    setIsDone,
    createFranchiseRenewal,
  };
}
