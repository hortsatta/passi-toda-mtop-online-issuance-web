import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { passwordForgot as passwordForgotApi } from '../api/user.api';

type Result = {
  isEmailSent: boolean;
  loading: boolean;
  passwordForgot: (email: string) => Promise<void>;
};

export function useUserPasswordForgot(): Result {
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);

  const { mutateAsync, isPending } = useMutation(passwordForgotApi());

  const passwordForgot = useCallback(
    async (email: string) => {
      const result = await mutateAsync(email);
      setIsEmailSent(!!result);
    },
    [mutateAsync],
  );

  return {
    isEmailSent,
    loading: isPending,
    passwordForgot,
  };
}
