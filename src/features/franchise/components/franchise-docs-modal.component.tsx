import { memo, useEffect, useState } from 'react';

import { useBaseDownload } from '#/base/hooks/use-base-download-file.hook';
import { BaseButton } from '#/base/components/base-button.component';
import { BaseModal } from '#/base/components/base-modal.component';

import type { ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof BaseModal>, 'open'> & {
  src: string | null;
  title?: string;
};

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
      {!!localSrc && (
        <img
          className='inline-block h-full w-full overflow-hidden object-contain'
          src={localSrc}
          alt={title}
        />
      )}
    </BaseModal>
  );
});
