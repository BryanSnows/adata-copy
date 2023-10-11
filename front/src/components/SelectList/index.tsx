import { IconButton, InputLabel, MenuItem } from '@mui/material';
import { SelectTime } from '../SelectTime/types';
import { ReactComponent as Clock } from '../../assets/icons/clock.svg';
import { ReactComponent as Close } from '../../assets/icons/x.svg';

import { useEffect, useState } from 'react';
import { InputControl, SelectMUI } from './styles';

export function SelectList({
  onChangeValue,
  currentValue,
  width,
  label,
  placeholder,
  data,
  text,
  id,
  rest,
  hour,
  disabled,
  fullWidth,
  clearValue,
}: SelectTime) {
  const [option, setOption] = useState([]);
  useEffect(() => {
    if (data) {
      setOption(data);
    }
  }, [data]);

  const ITEM_HEIGHT = 48;

  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      },
    },
  };

  return (
    <InputControl
      fullWidth={fullWidth}
      variant="filled"
      className="formControl"
      width={width}
      disabled={disabled}
    >
      <InputLabel id={id}>{label}</InputLabel>
      <SelectMUI
        label={label}
        displayEmpty
        placeholder={placeholder}
        labelId={label}
        id={id}
        {...rest}
        value={currentValue}
        onChange={(newValue) => onChangeValue && onChangeValue(newValue)}
        MenuProps={MenuProps}
        defaultValue={''}
        IconComponent={hour && Clock}
        endAdornment={
          clearValue && (
            <IconButton
              onClick={clearValue}
              sx={{
                visibility: currentValue ? 'visible' : 'hidden',
                margin: '8px',
                marginBottom: '3px',
                marginLeft: '3px',
              }}
            >
              <Close />
            </IconButton>
          )
        }
      >
        {text && (
          <MenuItem value="Todos">
            <em>{text}</em>
          </MenuItem>
        )}

        {option.map((item, index) => (
          <MenuItem value={item.value} key={index}>
            {item.name}
          </MenuItem>
        ))}
      </SelectMUI>
    </InputControl>
  );
}
