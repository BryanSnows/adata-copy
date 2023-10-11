export type IData = {
  value: any;
  setDatePicker?: (value: any) => void;
  label: string;
  width?: string;
  line: string;
  onChangeValue?: (value: any) => void;
  clean?: boolean;
};
