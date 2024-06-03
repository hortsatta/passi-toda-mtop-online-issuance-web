import { useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import {
  getCurrentUser,
  registerIssuerUser,
  registerMemberUser,
} from '../api/user.api';
import { UserRole } from '../models/user.model';

import type { User } from '../models/user.model';
import type { UserRegisterFormData } from '../models/user-form-data.model';

type Result = {
  register: (
    data: UserRegisterFormData,
    role: UserRole,
  ) => Promise<User | null>;
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

  const { mutateAsync: mutateRegisterIssuerUser } =
    useMutation(registerIssuerUser());

  const { mutateAsync: mutateRegisterMemberUser } =
    useMutation(registerMemberUser());

  const register = useCallback(
    async (data: UserRegisterFormData, role: UserRole) => {
      try {
        let newUser = null;

        if (role === UserRole.Issuer) {
          newUser = await mutateRegisterIssuerUser(data);
        } else if (role === UserRole.Member) {
          newUser = await mutateRegisterMemberUser(data);
        }

        return newUser;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    [mutateRegisterIssuerUser, mutateRegisterMemberUser],
  );

  const getUser = useCallback(async () => {
    const { data } = await fetchUser();
    return data as User;
  }, [fetchUser]);

  return { register, getUser };
}
