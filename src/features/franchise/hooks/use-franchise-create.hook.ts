import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryFranchiseKey } from '#/config/react-query-keys.config';
import {
  createFranchise as createFranchiseApi,
  validateUpsertFranchise as validateUpsertFranchiseApi,
  uploadFranchiseFiles as uploadFranchiseFilesApi,
} from '../api/franchise.api';

import type { FranchiseUpsertFormData } from '../models/franchise-form-data.model';
import type { Franchise } from '../models/franchise.model';

type Result = {
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  createFranchise: (data: FranchiseUpsertFormData) => Promise<Franchise>;
  loading?: boolean;
};

export function useFranchiseCreate(): Result {
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
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryFranchiseKey.list,
        });
      },
    }),
  );

  const createFranchise = useCallback(
    async (data: FranchiseUpsertFormData) => {
      const hasImages = [
        data.vehicleCRImgUrl,
        data.vehicleORImgUrl,
        data.todaAssocMembershipImgUrl,
        data.ownerDriverLicenseNoImgUrl,
        data.brgyClearanceImgUrl,
        data.voterRegRecordImgUrl,
      ].some(
        (imageData) =>
          !!(typeof imageData === 'string' ? imageData?.trim() : imageData),
      );

      if (!hasImages) {
        return mutateCreateFranchise(data);
      }

      await validateUpsertFranchise({ data });
      const imageResult = await mutateUploadFranchiseFiles(data);

      return mutateCreateFranchise({ ...data, ...imageResult });
    },
    [
      mutateCreateFranchise,
      mutateUploadFranchiseFiles,
      validateUpsertFranchise,
    ],
  );

  return {
    loading:
      isValidateFranchisePending ||
      isUploadFilesPending ||
      isCreateFranchisePending,
    isDone,
    setIsDone,
    createFranchise,
  };
}
