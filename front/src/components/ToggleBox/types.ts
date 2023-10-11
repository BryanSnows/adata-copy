export interface IToggleBox {
  isActive?: boolean;
  onOff?: boolean;
  onChangeInactive?: () => void;
  onChangeActive?: () => void;
  textActive?: string;
  textInactive?: string;
}
