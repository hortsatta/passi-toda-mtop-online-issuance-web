import type { ComponentProps, JSXElementConstructor } from 'react';

export type IconName =
  | 'arrow-counter-clockwise'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrows-clockwise'
  | 'calendar'
  | 'caret-circle-down'
  | 'caret-down'
  | 'caret-up'
  | 'caret-up-down'
  | 'check'
  | 'check-circle'
  | 'check-square'
  | 'check-square-offset'
  | 'circle'
  | 'eye'
  | 'eye-slash'
  | 'funnel-simple'
  | 'image'
  | 'magnifying-glass'
  | 'pencil-simple'
  | 'placeholder'
  | 'printer'
  | 'sign-out'
  | 'square'
  | 'tire'
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
