import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { confirmRegistration as confirmRegistrationApi } from '../api/auth.api';

type Result = {
  isConfirmed: boolean | null;
  loading: boolean;
  confirmRegistration: (token: string) => void;
};

export function useAuthConfirmRegistration(): Result {
  const [searchParams] = useSearchParams();
  const [isConfirmed, setIsConfirmed] = useState<boolean | null>(null);

  const { mutateAsync } = useMutation(confirmRegistrationApi());

  const confirmRegistration = useCallback(
    async (token: string) => {
      const result = await mutateAsync(token);
      setIsConfirmed(!!result);
    },
    [mutateAsync],
  );

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token?.length) {
      setIsConfirmed(false);
      return;
    }

    (async () => {
      await confirmRegistration(token);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isConfirmed,
    loading: isConfirmed === null,
    confirmRegistration,
  };
}
