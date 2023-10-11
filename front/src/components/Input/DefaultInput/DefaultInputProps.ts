import { InputHTMLAttributes } from 'react';

export type DefaultInputProps = {
  label?: string;
  width?: string;
  error?: string;
  line?: string;
  small?: boolean;
  isMultiline?: boolean;
  adornment?: string;
  shrink?: boolean;
  rows?: number;
  type?: string;
  showPassword?: boolean;
  toggleShowPassword?: () => void;
} & InputHTMLAttributes<HTMLInputElement>;
