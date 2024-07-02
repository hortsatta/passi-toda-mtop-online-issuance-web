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
  isPenalty,
  activatePenaltyAfterExpiryDays,
  isPenaltyActive,
}: any): RateSheetFee {
  return {
    name,
    amount: +amount,
    isPenalty,
    activatePenaltyAfterExpiryDays:
      activatePenaltyAfterExpiryDays != null
        ? +activatePenaltyAfterExpiryDays
        : undefined,
    isPenaltyActive: !!isPenaltyActive,
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

export function transformToRateSheetFeeFormData({
  name,
  amount,
  isPenalty,
  activatePenaltyAfterExpiryDays,
}: any) {
  return {
    name,
    amount: (amount / CENTAVOS).toString(),
    isPenalty,
    activatePenaltyAfterExpiryDays:
      activatePenaltyAfterExpiryDays != null
        ? +activatePenaltyAfterExpiryDays
        : undefined,
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

export function transformToRateSheetFeeUpsertDto({
  name,
  amount,
  isPenalty,
  activatePenaltyAfterExpiryDays,
}: any) {
  return {
    name,
    amount: +amount * CENTAVOS,
    isPenalty,
    activatePenaltyAfterExpiryDays:
      activatePenaltyAfterExpiryDays != null
        ? +activatePenaltyAfterExpiryDays
        : undefined,
  };
}
