import { kyInstance } from '#/config/ky.config';
import { generateApiError } from '#/core/helpers/api.helper';
import { transformToUser } from '../helpers/user-transform.helper';

import type { UseMutationOptions } from '@tanstack/react-query';
import type { AuthCredentials } from '../models/auth.model';
import type { User } from '../models/user.model';

const BASE_URL = 'auth';

export function signIn(
  options?: Omit<
    UseMutationOptions<
      { accessToken: string; user: User },
      Error,
      AuthCredentials,
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async (data: AuthCredentials): Promise<any> => {
    const url = `${BASE_URL}/sign-in`;

    try {
      const { accessToken, user } = (await kyInstance
        .post(url, { json: data })
        .json()) as any;

      return { accessToken, user: transformToUser(user) };
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}
