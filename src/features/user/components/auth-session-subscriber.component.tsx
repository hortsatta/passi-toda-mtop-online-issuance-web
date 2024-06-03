import { memo, useEffect } from 'react';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { useAuth } from '../hooks/use-auth.hook';
import { useUser } from '../hooks/use-user.hook';

export const AuthSessionSubscriber = memo(function () {
  const setUser = useBoundStore((state) => state.setUser);
  const { signOut } = useAuth();
  const { getUser } = useUser();

  useEffect(() => {
    // Fetch data from api and set current user, if error or user does not exist
    // then logout current session
    (async () => {
      try {
        const user = await getUser();

        if (!user) {
          signOut();
        } else {
          setUser(user as any);
        }
      } catch (error) {
        signOut();
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
});
