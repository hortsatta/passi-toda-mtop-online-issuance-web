import { TimeoutError } from 'ky';

import { capitalize } from './string.helper';

import type { HTTPError } from 'ky';

export const PAGINATION_TAKE = 16;

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.statusCode = statusCode;
  }
}

export async function generateApiError(error: HTTPError | TimeoutError) {
  if (error instanceof TimeoutError) {
    return new ApiError(capitalize(error.message), 408);
  }

  const errorRes = await (error as HTTPError).response.json();
  const getMessage = () => {
    if (Array.isArray(errorRes.message)) {
      return errorRes.message.length > 0 ? errorRes.message[0] : '';
    }
    return errorRes.message;
  };

  return new ApiError(capitalize(getMessage()), errorRes.statusCode);
}

export function generateError(
  errorCodeMessage: { [key: string]: string },
  statusCode?: number,
  isExact?: boolean,
) {
  if (!statusCode) {
    return null;
  }

  if (!isExact) {
    const code = parseInt(statusCode.toString()[0]);
    return new Error(errorCodeMessage[code]);
  }

  return new Error(errorCodeMessage[statusCode]);
}
