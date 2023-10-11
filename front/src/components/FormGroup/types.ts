import { PropsWithChildren, ReactNode } from "react";


export type FormGroupProps = {
  error?: string;
  errorPasswordNumber?: string;
  errorPasswordCaracter?: string;
  errorPasswordLet?: string;
  extraErrorMessage?: any;
  isfullwidth?: boolean | string;
} & PropsWithChildren<ReactNode>;
