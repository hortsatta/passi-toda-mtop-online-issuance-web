import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { signIn as signInApi } from '../api/auth.api';

import type { AuthCredentials } from '../models/auth.model';
import type { User } from '../models/user.model';

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || '';

type Result = {
  signIn: (credentials: AuthCredentials) => Promise<User>;
  signOut: () => Promise<void>;
};

export function useAuth(): Result {
  const setUser = useBoundStore((state) => state.setUser);

  const { mutateAsync: mutateSignInUser } = useMutation(signInApi());

  const signIn = useCallback(
    async (credentials: AuthCredentials) => {
      try {
        const { accessToken, user } = await mutateSignInUser(credentials);
        // Set jwt token to localstorage
        !!accessToken?.trim() &&
          localStorage.setItem(TOKEN_KEY, JSON.stringify({ accessToken }));
        user && setUser(user);

        return user;
      } catch (error: any) {
        setUser();
        throw new Error(error.message);
      }
    },
    [mutateSignInUser, setUser],
  );

  const signOut = useCallback(async () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser();
  }, [setUser]);

  return { signIn, signOut };
}
