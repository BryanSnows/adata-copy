import { ReactComponent as Cloud } from '../../../assets/icons/cloud.svg';
import { ButtonIconProps } from './ButtonIconProps';

import { CustomButton } from './styles';

export function ButtonIcon({ label, cloud, ...rest }: ButtonIconProps) {
  return (
    <CustomButton type="button" cloudStyle={cloud} {...rest}>
      {cloud ? label?.toUpperCase() : label}
      {cloud && <Cloud />}
    </CustomButton>
  );
}
