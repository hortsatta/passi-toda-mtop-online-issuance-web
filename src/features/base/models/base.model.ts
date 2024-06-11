import type { ComponentProps, JSXElementConstructor } from 'react';

export type IconName =
  | 'arrow-counter-clockwise'
  | 'calendar'
  | 'caret-circle-down'
  | 'check-circle'
  | 'eye'
  | 'eye-slash'
  | 'image'
  | 'pencil-simple'
  | 'sign-out'
  | 'trash'
  | 'user'
  | 'user-circle-plus'
  | 'x'
  | 'x-circle';

export type SelectItem = {
  value: string | number;
  label?: string;
};

export type ButtonVariant = 'primary' | 'accent' | 'accept' | 'warn';

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
