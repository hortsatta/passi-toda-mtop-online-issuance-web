import dayjs from '#/config/dayjs.config';

export function transformAuditTrail(
  id: number,
  createdAt: string,
  updatedAt: string,
  deletedAt?: string,
) {
  return {
    id,
    createdAt: dayjs(createdAt).toDate(),
    updatedAt: dayjs(updatedAt).toDate(),
    deletedAt: deletedAt ? dayjs(deletedAt).toDate() : undefined,
  };
}

export function getErrorMessage(value: { [key: string]: any }): string | null {
  let errorMessage = null;

  const getMessage = (value: { [key: string]: any }) => {
    for (const key in value) {
      if (key === 'message') {
        errorMessage = value[key] as string;
      } else if (typeof value[key] === 'object') {
        getMessage(value[key]);
      }
    }
  };

  getMessage(value);
  return errorMessage;
}