import type { ComponentProps, JSXElementConstructor } from 'react';

export type IconName =
  | 'arrow-counter-clockwise'
  | 'calendar'
  | 'caret-circle-down'
  | 'eye'
  | 'eye-slash'
  | 'image'
  | 'sign-out'
  | 'user'
  | 'user-circle-plus'
  | 'x';

export type FormProps<
  TProps extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
  TData,
  TDataReturn,
> = Omit<ComponentProps<TProps>, 'onSubmit'> & {
  onSubmit: (data: TData) => TDataReturn;
  formData?: TData;
  loading?: boolean;
  isDone?: boolean;
  onDone?: (isDone: boolean) => void;
  onDelete?: () => void;
};
