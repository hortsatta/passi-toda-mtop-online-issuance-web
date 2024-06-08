import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

type Result = {
  isFetching: boolean;
  download: (url: string, name?: string) => () => Promise<void>;
};

export function useBaseDownload(): Result {
  const [isFetching, setIsFetching] = useState(false);

  const download = useCallback(
    (url: string, name?: string) => async () => {
      if (!url) {
        toast.error('Resource URL not provided');
        return;
      }

      const filename = name?.length ? name : url.split('/').pop();

      try {
        setIsFetching(true);
        const res = await fetch(url);
        const blob = await res.blob();

        setIsFetching(false);
        const blobURL = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobURL;
        a.className = 'hidden';

        if (filename?.length) a.download = filename;
        document.body.appendChild(a);
        a.click();
      } catch (error) {
        toast.error('An error occured');
      }
    },
    [],
  );

  return {
    download,
    isFetching,
  };
}
