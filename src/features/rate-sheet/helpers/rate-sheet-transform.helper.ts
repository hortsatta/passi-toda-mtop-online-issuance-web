import { CENTAVOS, transformAuditTrail } from '#/core/helpers/core.helper';

import type { RateSheet, RateSheetFee } from '../models/rate-sheet.model';

export function transformToRateSheet({
  id,
  createdAt,
  updatedAt,
  deletedAt,
  name,
  feeType,
  rateSheetFees,
}: any): RateSheet {
  const transformedRateSheetFees = rateSheetFees.map((rateSheetFee: any) =>
    transformToRateSheetFee(rateSheetFee),
  );

  return {
    name,
    feeType,
    rateSheetFees: transformedRateSheetFees,
    ...transformAuditTrail(id, createdAt, updatedAt, deletedAt),
  };
}

export function transformToRateSheetFee({
  id,
  createdAt,
  updatedAt,
  deletedAt,
  name,
  amount,
}: any): RateSheetFee {
  return {
    name,
    amount: +amount,
    ...transformAuditTrail(id, createdAt, updatedAt, deletedAt),
  };
}

export function transformToRateSheetFormData({
  name,
  feeType,
  rateSheetFees,
}: any) {
  const transformedRateSheetFees = rateSheetFees.map((fee: any) =>
    transformToRateSheetFeeFormData(fee),
  );

  return {
    name,
    feeType,
    rateSheetFees: transformedRateSheetFees,
  };
}

export function transformToRateSheetFeeFormData({ name, amount }: any) {
  return {
    name,
    amount: (amount / CENTAVOS).toString(),
  };
}

export function transformToRateSheetUpsertDto({
  name,
  feeType,
  rateSheetFees,
}: any) {
  const transformedRateSheetFees = rateSheetFees.map((fee: any) =>
    transformToRateSheetFeeUpsertDto(fee),
  );

  return {
    name,
    feeType,
    rateSheetFees: transformedRateSheetFees,
  };
}

export function transformToRateSheetFeeUpsertDto({ name, amount }: any) {
  return {
    name,
    amount: amount * CENTAVOS,
  };
}
