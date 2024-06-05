import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';

import { createUserSlice } from '#/user/user.store';
import { createFranchiseSlice } from '#/franchise/franchise.store';

import type { UserSlice } from '#/user/models/user.model';
import type { FranchiseSlice } from '#/franchise/models/franchise.model';

export const useBoundStore = create<UserSlice & FranchiseSlice>()(
  devtools(
    persist(
      subscribeWithSelector((...a) => ({
        ...createUserSlice(...a),
        ...createFranchiseSlice(...a),
      })),
      {
        name: 'main-storage',
        partialize: (state) => ({
          franchiseFormData: state.franchiseFormData,
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
