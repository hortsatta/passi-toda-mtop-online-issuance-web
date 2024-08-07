import { FeeType } from '../models/rate-sheet.model';

import type { SelectItem } from '#/base/models/base.model';
import type { RateSheetFeeUpsertFormData } from '../models/rate-sheet-form-data.model';

export const franchiseFeeTypeName = {
  [FeeType.FranchiseRegistration]: 'Franchise Registration',
  [FeeType.FranchiseRenewal]: 'Franchise Renewal',
};

export const franchiseFeeTypeSelectOptions: SelectItem[] = [
  {
    value: FeeType.FranchiseRegistration,
    label: 'Registration',
  },
  {
    value: FeeType.FranchiseRenewal,
    label: 'Renewal',
  },
];

export function createRateSheetFeeDefaultValues(
  isPenalty = false,
  name?: string,
): Partial<RateSheetFeeUpsertFormData> {
  return isPenalty
    ? {
        name,
        amount: undefined,
        isPenalty: true,
      }
    : {
        name: '',
        amount: undefined,
        isPenalty: false,
      };
}
