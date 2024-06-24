import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import { PDF_FILE_EXT } from '#/base/helpers/base-file.helper';
import { useBaseDownload } from '#/base/hooks/use-base-download-file.hook';
import { BaseButton } from '#/base/components/base-button.component';
import { BaseModal } from '#/base/components/base-modal.component';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import type { ComponentProps } from 'react';
import { BaseButtonSimple } from '#/base/components/base-button-simple.component';
import cx from 'classix';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

type Props = Omit<ComponentProps<typeof BaseModal>, 'open'> & {
  src: string | null;
  title?: string;
};

type FileViewerProps = {
  src?: string;
  title?: string;
};

const FileViewer = memo(function ({ src, title }: FileViewerProps) {
  const [pdfTotalPages, setPdfTotalPages] = useState(0);
  const [pdfCurrentPage, setPdfCurrentPage] = useState(1);

  const isPdf = useMemo(() => {
    const filename = src?.split('/').pop();
    return filename?.split('.').pop()?.includes(PDF_FILE_EXT);
  }, [src]);

  const handlePdfLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setPdfTotalPages(numPages);
    },
    [],
  );

  const handlePdfPageChange = useCallback(
    (next: boolean) => () => {
      if (next) {
        const page =
          pdfCurrentPage < pdfTotalPages ? pdfCurrentPage + 1 : pdfTotalPages;
        setPdfCurrentPage(page);
      } else {
        const page = pdfCurrentPage > 1 ? pdfCurrentPage - 1 : 1;
        setPdfCurrentPage(page);
      }
    },
    [pdfCurrentPage, pdfTotalPages],
  );

  return (
    <div className='h-full w-full'>
      {isPdf ? (
        <div className='pdf-viewer flex h-full w-full flex-col gap-4 pb-10'>
          <Document
            className='h-full w-full'
            file={src}
            onLoadSuccess={handlePdfLoadSuccess}
          >
            <Page
              className='flex h-full w-full justify-center overflow-auto'
              pageNumber={pdfCurrentPage}
            />
          </Document>
          <div className='flex w-full items-center justify-between gap-5'>
            <BaseButtonSimple
              className={cx(pdfTotalPages <= 1 && 'opacity-0')}
              iconName='arrow-left'
              disabled={pdfCurrentPage <= 1}
              onClick={handlePdfPageChange(false)}
            />
            <p className='text-center'>
              Page {pdfCurrentPage} of {pdfTotalPages}
            </p>
            <BaseButtonSimple
              className={cx(pdfTotalPages <= 1 && 'opacity-0')}
              iconName='arrow-right'
              disabled={pdfCurrentPage >= pdfTotalPages}
              onClick={handlePdfPageChange(true)}
            />
          </div>
        </div>
      ) : (
        <img
          className='inline-block h-full w-full overflow-hidden object-contain'
          src={src}
          alt={title}
        />
      )}
    </div>
  );
});

export const FranchiseDocsModal = memo(function ({
  src,
  title,
  ...moreProps
}: Props) {
  const { download, isFetching } = useBaseDownload();
  const [localSrc, setLocalSrc] = useState(src);

  useEffect(() => {
    if (!src?.trim()) return;
    setLocalSrc(src);
  }, [src]);

  return (
    <BaseModal
      open={!!src}
      title={title}
      rightComponent={
        <BaseButton disabled={isFetching} onClick={download(localSrc || '')}>
          Download File
        </BaseButton>
      }
      fullSize
      {...moreProps}
    >
      {!!localSrc && <FileViewer src={localSrc} title={title} />}
    </BaseModal>
  );
});
