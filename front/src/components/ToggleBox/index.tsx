import { useTranslation } from 'react-i18next';
import { Toggle, ToggleContainer } from './styles';
import { IToggleBox } from './types';

export function ToggleBox({
  onOff,
  onChangeActive,
  onChangeInactive,
  textActive,
  textInactive,
}: IToggleBox) {
  const { t } = useTranslation();
  return (
    <ToggleContainer>
      <Toggle isActive={onOff === true}>
        <button onClick={onChangeActive}>
          {!textActive ? t('active') : textActive}{' '}
        </button>
      </Toggle>
      <Toggle isActive={onOff === false}>
        <button onClick={onChangeInactive}>
          {!textActive ? t('inactive') : textInactive}
        </button>
      </Toggle>
    </ToggleContainer>
  );
}
