import { ButtonMainProps } from './types';
import { ButtonCreateContainer } from './styles';

export function ButtonMain({
  label,
  ...rest
}: ButtonMainProps) {
  return (
    <ButtonCreateContainer
      type="button"
      {...rest}
    >
      {label}
    </ButtonCreateContainer>
  );
}
