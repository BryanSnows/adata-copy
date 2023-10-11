import { TextFieldProps } from '@mui/material';

export type SelectProps = {
  id: string;
  label: string;
  placeholder: string;
  width?: string;
  _errorLabel?: boolean;
  disable?: boolean;
  values?: any;
  double?: boolean;
  currentValue?: any;
  text?: string;
  onChangeValue?: (value: any) => void;
} & TextFieldProps;
