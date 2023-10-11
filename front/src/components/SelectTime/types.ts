export type SelectTime = {
  onChangeValue?: (value: any) => void;
  currentValue?: any;
  width?: string;
  label?: string;
  placeholder?: string;
  data: any[];
  hour?: boolean;
  text?: string;
  skrink?: boolean;
  clearValue?: (value: any) => void;
  disabled?: boolean;
  id?: string;
  rest?: any;
  fullWidth?: boolean;
};
