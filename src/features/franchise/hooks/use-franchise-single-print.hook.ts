import { useCallback, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import toast from 'react-hot-toast';

import type { ReactInstance } from 'react';
import type { IReactToPrintProps } from 'react-to-print';
import type { Franchise } from '../models/franchise.model';

type Result = {
  print: (event?: unknown, content?: () => ReactInstance | null) => void;
};

type Props = IReactToPrintProps & {
  franchise?: Franchise;
};

export function useFranchiseSinglePrint({
  franchise,
  documentTitle,
  bodyClass,
  onBeforeGetContent,
  onAfterPrint,
  ...moreProps
}: Props): Result {
  const toastRef = useRef<string | null>(null);

  const handleOnBeforeGetContent = useCallback(() => {
    toastRef.current = toast.loading('Opening print dialog', {
      id: 'print-toast',
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
    bodyClass: bodyClass || 'print-franchise',
    ...moreProps,
  });

  useEffect(() => {
    if (!franchise) return;
    // TEMP
    // const timeout = setTimeout((): any => {
    //   print();
    //   clearTimeout(timeout);
    // }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [franchise]);

  return {
    print,
  };
}
