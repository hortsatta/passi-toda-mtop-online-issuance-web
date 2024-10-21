import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import {
  verifyUserToken as verifyUserTokenApi,
  passwordReset as passwordResetApi,
} from '../api/user.api';

type Result = {
  isVerified: boolean | null;
  isResetDone: boolean;
  loading: boolean;
  resetLoading: boolean;
  passwordReset: (password: string) => Promise<void>;
};

export function useUserPasswordReset(): Result {
  const [searchParams] = useSearchParams();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isResetDone, setIsResetDone] = useState<boolean>(false);

  const { mutateAsync: mutateVerifyUserToken } =
    useMutation(verifyUserTokenApi());

  const {
    mutateAsync: mutatePasswordReset,
    isPending: isPasswordResetPending,
  } = useMutation(passwordResetApi());

  const verifyUserToken = useCallback(
    async (token: string) => {
      try {
        const result = await mutateVerifyUserToken(token);
        setIsVerified(!!result);
      } catch (error) {
        setIsVerified(false);
      }
    },
    [mutateVerifyUserToken],
  );

  const passwordReset = useCallback(
    async (password: string) => {
      const data = { token: searchParams.get('token') || '', password };
      const result = await mutatePasswordReset(data);
      setIsResetDone(!!result);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mutatePasswordReset],
  );

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token?.length) {
      setIsVerified(false);
      return;
    }

    (async () => {
      await verifyUserToken(token);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isVerified,
    isResetDone,
    loading: isVerified === null,
    resetLoading: isPasswordResetPending,
    passwordReset,
  };
}
