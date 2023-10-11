import { ReactComponent as Clock } from '../../assets/icons/clock.svg';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { Container } from './styles';
import { SelectTime } from './types';
import { IconButton, Box } from '@mui/material';
import { ReactComponent as Close } from '../../assets/icons/x.svg';

export function SelectHour({
  onChangeValue,
  currentValue,
  width,
  label,
  placeholder,
  data,
  skrink,
  clearValue,
  disabled,
}: SelectTime) {
  const MenuProps: any = {
    autoFocus: false,
    PaperProps: {
      style: {
        height: '300px',
        overflowY: 'scroll',
        possition: 'relative',
      },
    },
  };

  return (
    <Container width={width}>
      <FormControl
        variant="filled"
        className="formControl"
        style={{
          background: 'rgb(252, 252, 252)',
        }}
        disabled={disabled}
      >
        <InputLabel id="demo-simple-select-filled-label" shrink={skrink}>
          {label}
        </InputLabel>
        <Select
          disableUnderline
          label={label}
          placeholder={placeholder}
          labelId="labelTime"
          id="demo-simple-select-filled-label"
          value={currentValue}
          MenuProps={MenuProps}
          endAdornment={
            clearValue && (
              <IconButton
                onClick={clearValue}
                sx={{
                  visibility: currentValue ? 'visible' : 'hidden',
                  margin: '8px',
                }}
              >
                <Close />
              </IconButton>
            )
          }
          onChange={(newValue) => onChangeValue && onChangeValue(newValue)}
          IconComponent={Clock}
        >
          {data.map((item, index) => (
            <MenuItem value={item} key={index}>
              {item}:00
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Container>
  );
}
