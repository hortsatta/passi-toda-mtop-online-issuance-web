import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';

import { createUserSlice } from '../../user/user.store';

import type { UserSlice } from '../../user/models/user.model';

// CoreSlice & UserSlice

export const useBoundStore = create<UserSlice>()(
  devtools(
    persist(
      subscribeWithSelector((...a) => ({
        // ...createCoreSlice(...a),
        ...createUserSlice(...a),
      })),
      {
        name: 'main-storage',
        // partialize: (state) => ({
        //   sidebarMode: state.sidebarMode,
        // }),
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
