import dayjs from '#/config/dayjs.config';

import type { RateSheetFeeUpsertFormData } from '#/rate-sheet/models/rate-sheet-form-data.model';
import type { RateSheetFee } from '#/rate-sheet/models/rate-sheet.model';

export const CENTAVOS = 100;

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

export function convertToCurrency(
  target: RateSheetFee[] | RateSheetFeeUpsertFormData[] | number,
  isCentavos = true,
) {
  if (Array.isArray(target)) {
    const amount = target.reduce(
      (total, current) => +current.amount + total,
      0,
    );

    const finalAmount = (isCentavos ? amount / CENTAVOS : amount).toFixed(2);

    return `₱${finalAmount}`;
  }

  const amount = (isCentavos ? target / CENTAVOS : target).toFixed(2);

  return `₱${amount}`;
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
