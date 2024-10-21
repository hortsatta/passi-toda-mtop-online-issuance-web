import { forwardRef, memo, useMemo } from 'react';
import {
  ArrowCounterClockwise,
  ArrowFatLinesUp,
  ArrowLeft,
  ArrowRight,
  ArrowsClockwise,
  Calendar,
  CaretCircleDown,
  CaretDown,
  CaretUp,
  CaretUpDown,
  Check,
  CheckCircle,
  CheckSquare,
  CheckSquareOffset,
  Circle,
  CubeFocus,
  Eye,
  EyeSlash,
  FilePdf,
  FunnelSimple,
  Image,
  MagnifyingGlass,
  Password,
  PencilSimple,
  Placeholder,
  Plus,
  Printer,
  Rows,
  SignOut,
  Square,
  SquaresFour,
  Tire,
  Trash,
  User,
  UserCirclePlus,
  X,
  XCircle,
  XSquare,
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
        case 'arrow-fat-lines-up':
          return ArrowFatLinesUp;
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
        case 'caret-down':
          return CaretDown;
        case 'caret-up':
          return CaretUp;
        case 'caret-up-down':
          return CaretUpDown;
        case 'check':
          return Check;
        case 'check-circle':
          return CheckCircle;
        case 'check-square':
          return CheckSquare;
        case 'check-square-offset':
          return CheckSquareOffset;
        case 'circle':
          return Circle;
        case 'cube-focus':
          return CubeFocus;
        case 'eye':
          return Eye;
        case 'eye-slash':
          return EyeSlash;
        case 'file-pdf':
          return FilePdf;
        case 'funnel-simple':
          return FunnelSimple;
        case 'image':
          return Image;
        case 'magnifying-glass':
          return MagnifyingGlass;
        case 'password':
          return Password;
        case 'pencil-simple':
          return PencilSimple;
        case 'placeholder':
          return Placeholder;
        case 'plus':
          return Plus;
        case 'printer':
          return Printer;
        case 'rows':
          return Rows;
        case 'sign-out':
          return SignOut;
        case 'square':
          return Square;
        case 'squares-four':
          return SquaresFour;
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
        case 'x-square':
          return XSquare;
      }
    }, [name]);

    if (!Icon) {
      return null;
    }

    return <Icon ref={ref} {...moreProps} />;
  }),
);
