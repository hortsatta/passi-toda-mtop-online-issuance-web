import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';

import { createUserSlice } from '#/user/user.store';
import { createFranchiseSlice } from '#/franchise/stores/franchise.store';
import { createFranchiseRenewalSlice } from '#/franchise/stores/franchise-renewal.store';
import { createTodaAssociationSlice } from '#/toda-association/toda-association.store';
import { createRateSheetSlice } from '#/rate-sheet/rate-sheet.store';

import type { UserSlice } from '#/user/models/user.model';
import type { FranchiseSlice } from '#/franchise/models/franchise.model';
import type { FranchiseRenewalSlice } from '#/franchise/models/franchise-renewal.model';
import type { TodaAssociationSlice } from '#/toda-association/models/toda-association.model';
import type { RateSheetSlice } from '#/rate-sheet/models/rate-sheet.model';

export const useBoundStore = create<
  UserSlice &
    FranchiseSlice &
    FranchiseRenewalSlice &
    TodaAssociationSlice &
    RateSheetSlice
>()(
  devtools(
    persist(
      subscribeWithSelector((...a) => ({
        ...createUserSlice(...a),
        ...createFranchiseSlice(...a),
        ...createFranchiseRenewalSlice(...a),
        ...createTodaAssociationSlice(...a),
        ...createRateSheetSlice(...a),
      })),
      {
        name: 'main-storage',
        partialize: (state) => ({
          franchiseFormData: state.franchiseFormData,
          franchiseRenewalFormData: state.franchiseRenewalFormData,
          todaAssociationFormData: state.todaAssociationFormData,
          rateSheetFormData: state.rateSheetFormData,
        }),
        // Always set user field's initial value to undefined, to prevent localstorage manipulation
        merge: (persistedState, currentState) => ({
          ...currentState,
          ...(persistedState as any),
          user: undefined,
        }),
      },
    ),
  ),
);
