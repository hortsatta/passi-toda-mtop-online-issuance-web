import { forwardRef, memo, useMemo } from 'react';
import {
  ArrowCounterClockwise,
  Calendar,
  CaretCircleDown,
  CheckCircle,
  Eye,
  EyeSlash,
  Image,
  PencilSimple,
  SignOut,
  User,
  UserCirclePlus,
  X,
  XCircle,
} from '@phosphor-icons/react';

import type { Icon as PhosphorIcon, IconProps } from '@phosphor-icons/react';
import type { IconName } from '../models/base.model';
import { Trash } from '@phosphor-icons/react/dist/ssr';

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
        case 'check-circle':
          return CheckCircle;
        case 'eye':
          return Eye;
        case 'eye-slash':
          return EyeSlash;
        case 'image':
          return Image;
        case 'pencil-simple':
          return PencilSimple;
        case 'sign-out':
          return SignOut;
        case 'trash':
          return Trash;
        case 'user':
          return User;
        case 'user-circle-plus':
          return UserCirclePlus;
        case 'x':
          return X;
        case 'x-circle':
          return XCircle;
      }
    }, [name]);

    if (!Icon) {
      return null;
    }

    return <Icon ref={ref} {...moreProps} />;
  }),
);
