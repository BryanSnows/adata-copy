import { ButtonHTMLAttributes } from 'react';

export type ButtonIconProps = {
  label?: string;
  cloud?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;
