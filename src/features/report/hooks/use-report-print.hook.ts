import { useCallback, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import toast from 'react-hot-toast';

import type { ReactInstance } from 'react';
import type { IReactToPrintProps } from 'react-to-print';

type Result = {
  print: (event?: unknown, content?: () => ReactInstance | null) => void;
};

export function useReportPrint({
  documentTitle,
  bodyClass,
  onBeforeGetContent,
  onAfterPrint,
  ...moreProps
}: IReactToPrintProps): Result {
  const toastRef = useRef<string | null>(null);

  const handleOnBeforeGetContent = useCallback(() => {
    toastRef.current = toast.loading('Opening print dialog', {
      duration: 1000,
    });

    onBeforeGetContent && onBeforeGetContent();
  }, [onBeforeGetContent]);

  const handleAfterPrint = useCallback(() => {
    !!toastRef?.current && toast.dismiss(toastRef.current);
    onAfterPrint && onAfterPrint();
  }, [onAfterPrint]);

  const print = useReactToPrint({
    documentTitle: documentTitle || 'Report',
    onBeforeGetContent: handleOnBeforeGetContent,
    onAfterPrint: handleAfterPrint,
    removeAfterPrint: true,
    bodyClass: bodyClass || 'print-table',
    ...moreProps,
  });

  return {
    print,
  };
}
