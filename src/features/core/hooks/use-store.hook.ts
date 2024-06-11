import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';

import { createUserSlice } from '#/user/user.store';
import { createFranchiseSlice } from '#/franchise/franchise.store';
import { createTodaAssociationSlice } from '#/toda-association/toda-association.store';

import type { UserSlice } from '#/user/models/user.model';
import type { FranchiseSlice } from '#/franchise/models/franchise.model';
import type { TodaAssociationSlice } from '#/toda-association/models/toda-association.model';

export const useBoundStore = create<
  UserSlice & FranchiseSlice & TodaAssociationSlice
>()(
  devtools(
    persist(
      subscribeWithSelector((...a) => ({
        ...createUserSlice(...a),
        ...createFranchiseSlice(...a),
        ...createTodaAssociationSlice(...a),
      })),
      {
        name: 'main-storage',
        partialize: (state) => ({
          franchiseFormData: state.franchiseFormData,
          todaAssociationFormData: state.todaAssociationFormData,
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
