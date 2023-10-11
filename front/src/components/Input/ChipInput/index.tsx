import ChipInput from 'material-ui-chip-input';
import { Container } from './styles';
import { IChipInput } from './types';
import { formatToOnlyNumberAndLetters } from '../../../utils/formatToOnlyNumberAndLetters';
import { useTranslation } from 'react-i18next';

export function ChipInpuT({
  label,
  currentValue,
  id,
  maxLength,
  disabled,
  onChangeValue,
  onAdd,
  onDelete,
}: IChipInput) {
  const { t } = useTranslation();
  return (
    <Container>
      {/* @ts-ignore */}
      <ChipInput
        variant="filled"
        id={id}
        label={`${label} (${t('press-enter')})`}
        onChange={(chips: any) => onChangeValue && onChangeValue(chips)}
        onAdd={(chip) => onAdd && onAdd(chip)}
        onDelete={(chip) => onDelete && onDelete(chip)}
        value={currentValue}
        fullWidth={true}
        error={false}
        disabled={disabled}
        onInput={(e: any) =>
          (e.target.value = formatToOnlyNumberAndLetters(
            e.target.value
              .replaceAll('/', '')
              .replaceAll('_', '')
              .replaceAll('.', '')
              .replaceAll('-', '')
              .trimStart(),
          ))
        }
        style={{
          fontSize: '10px',
        }}
        InputProps={{
          inputProps: {
            maxLength: maxLength,
          },
        }}
      />
    </Container>
  );
}
