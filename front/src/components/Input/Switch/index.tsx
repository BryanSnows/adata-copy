import { SwitchStyled } from './styles';
import { SwitchProps } from './SwitchProps';

export function Switch({ checked, active, title, onChange }: SwitchProps) {
  return (
    <SwitchStyled
      size="small"
      checked={checked}
      onChange={onChange}
      disabled={active}
      title={title}
    />
  );
}
