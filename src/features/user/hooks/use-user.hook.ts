import { useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import {
  getCurrentUser,
  registerMemberUser,
  registerTreasurerUser,
  registerIssuerUser,
} from '../api/user.api';
import { UserRole } from '../models/user.model';

import type { User } from '../models/user.model';
import type { UserCreateFormData } from '../models/user-form-data.model';

type Result = {
  register: (data: UserCreateFormData, role: UserRole) => Promise<User | null>;
  getUser: () => Promise<User>;
};

export function useUser(): Result {
  const user = useBoundStore((state) => state.user);

  const { refetch: fetchUser } = useQuery(
    getCurrentUser({
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      enabled: false,
      retry: false,
      retryOnMount: false,
      initialData: user,
    }),
  );

  const { mutateAsync: mutateRegisterMemberUser } =
    useMutation(registerMemberUser());

  const { mutateAsync: mutateRegisterTreasurerUser } = useMutation(
    registerTreasurerUser(),
  );

  const { mutateAsync: mutateRegisterIssuerUser } =
    useMutation(registerIssuerUser());

  const register = useCallback(
    async (data: UserCreateFormData, role: UserRole) => {
      try {
        let newUser = null;

        switch (role) {
          case UserRole.Member:
            newUser = await mutateRegisterMemberUser(data);
            break;
          case UserRole.Treasurer:
            newUser = await mutateRegisterTreasurerUser(data);
            break;
          case UserRole.Issuer:
            newUser = await mutateRegisterIssuerUser(data);
            break;
        }

        return newUser;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    [
      mutateRegisterMemberUser,
      mutateRegisterTreasurerUser,
      mutateRegisterIssuerUser,
    ],
  );

  const getUser = useCallback(async () => {
    const { data } = await fetchUser();
    return data as User;
  }, [fetchUser]);

  return { register, getUser };
}
