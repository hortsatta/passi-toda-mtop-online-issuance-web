import type { ComponentProps, JSXElementConstructor } from 'react';

export type IconName =
  | 'arrow-counter-clockwise'
  | 'arrow-fat-lines-up'
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
  | 'cube-focus'
  | 'eye'
  | 'eye-slash'
  | 'file-pdf'
  | 'funnel-simple'
  | 'image'
  | 'list'
  | 'magnifying-glass'
  | 'password'
  | 'pencil-simple'
  | 'placeholder'
  | 'plus'
  | 'printer'
  | 'rows'
  | 'sign-out'
  | 'square'
  | 'squares-four'
  | 'tire'
  | 'trash'
  | 'user'
  | 'user-circle-plus'
  | 'x'
  | 'x-circle'
  | 'x-square';

export type SelectItem = {
  value: string | number;
  label?: string;
};

export type NavItem = {
  to: string;
  label: string;
};

export type NavItemList = {
  label: string;
  items: NavItem[];
};

export type ButtonVariant = 'primary' | 'accent' | 'accept' | 'warn';

export type ListView = 'strip' | 'grid';

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
