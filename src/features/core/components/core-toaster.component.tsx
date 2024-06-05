import { memo, useEffect } from 'react';
import t, { Toaster, useToasterStore } from 'react-hot-toast';

import type { ComponentProps } from 'react';

const TOAST_LIMIT = 3;

const toastOptions = {
  className: 'rounded bg-gray-700 text-text text-base',
};

export const CoreToaster = memo(function (
  props: ComponentProps<typeof Toaster>,
) {
  const { toasts } = useToasterStore();

  // Limit max visible toast
  useEffect(() => {
    toasts
      .filter((toast) => toast.visible)
      .filter((_, index) => index >= TOAST_LIMIT)
      .forEach((toast) => t.dismiss(toast.id));
  }, [toasts]);

  return (
    <Toaster
      containerClassName='mt-24'
      position='top-center'
      toastOptions={toastOptions}
      {...props}
    />
  );
});
