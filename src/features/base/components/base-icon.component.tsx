import { forwardRef, memo, useMemo } from 'react';
import {
  ArrowCounterClockwise,
  ArrowLeft,
  ArrowRight,
  ArrowsClockwise,
  Calendar,
  CaretCircleDown,
  Check,
  CheckCircle,
  CheckSquare,
  CheckSquareOffset,
  Eye,
  EyeSlash,
  FunnelSimple,
  Image,
  MagnifyingGlass,
  PencilSimple,
  SignOut,
  Square,
  Tire,
  Trash,
  User,
  UserCirclePlus,
  X,
  XCircle,
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
        case 'arrow-left':
          return ArrowLeft;
        case 'arrow-right':
          return ArrowRight;
        case 'arrows-clockwise':
          return ArrowsClockwise;
        case 'calendar':
          return Calendar;
        case 'caret-circle-down':
          return CaretCircleDown;
        case 'check':
          return Check;
        case 'check-circle':
          return CheckCircle;
        case 'check-square':
          return CheckSquare;
        case 'check-square-offset':
          return CheckSquareOffset;
        case 'eye':
          return Eye;
        case 'eye-slash':
          return EyeSlash;
        case 'funnel-simple':
          return FunnelSimple;
        case 'image':
          return Image;
        case 'magnifying-glass':
          return MagnifyingGlass;
        case 'pencil-simple':
          return PencilSimple;
        case 'sign-out':
          return SignOut;
        case 'square':
          return Square;
        case 'tire':
          return Tire;
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
