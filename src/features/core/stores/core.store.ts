import type { StateCreator } from 'zustand';
import type { CoreSlice } from '../models/core.model';

export const createCoreSlice: StateCreator<CoreSlice, [], [], CoreSlice> = (
  set,
) => ({
  isMobileMenuOpen: true,
  toggleMobileMenu: (isOpen?: boolean) =>
    set((state) => ({
      isMobileMenuOpen: isOpen != null ? isOpen : !state.isMobileMenuOpen,
    })),
});
