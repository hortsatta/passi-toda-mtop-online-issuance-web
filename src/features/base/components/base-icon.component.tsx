import { forwardRef, memo, useMemo } from 'react';
import {
  ArrowCounterClockwise,
  Calendar,
  CaretCircleDown,
  Eye,
  EyeSlash,
  Image,
  SignOut,
  User,
  UserCirclePlus,
  X,
} from '@phosphor-icons/react';

import type { Icon as PhosphorIcon, IconProps } from '@phosphor-icons/react';
import type { IconName } from '../models/base.model';

type Props = IconProps & {
  name: IconName;
};

export const BaseIcon = memo(
  forwardRef<SVGSVGElement, Props>(function ({ name, ...moreProps }, ref) {
    const Icon: PhosphorIcon | null = useMemo(() => {
      switch (name) {
        case 'arrow-counter-clockwise':
          return ArrowCounterClockwise;
        case 'calendar':
          return Calendar;
        case 'caret-circle-down':
          return CaretCircleDown;
        case 'eye':
          return Eye;
        case 'eye-slash':
          return EyeSlash;
        case 'image':
          return Image;
        case 'sign-out':
          return SignOut;
        case 'user':
          return User;
        case 'user-circle-plus':
          return UserCirclePlus;
        case 'x':
          return X;
      }
    }, [name]);

    if (!Icon) {
      return null;
    }

    return <Icon ref={ref} {...moreProps} />;
  }),
);
