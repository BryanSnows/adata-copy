export interface IChipInput {
  label: string;
  currentValue?: Array<any>;
  maxLength: number;
  id: string;
  disabled: boolean;
  onChangeValue?: (value: any) => void;
  onAdd?: (value: any) => void;
  onDelete?: (value: any) => void;
}
