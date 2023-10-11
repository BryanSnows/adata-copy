import { InputLabel } from '@mui/material';
import { HelperText, InputControl, Option, SelectMUI } from './styles';
import { useTheme } from 'styled-components';
import { useEffect, useState } from 'react';

export function Select({
  id,
  options,
  label,
  onChange,
  value,
  fullWidth,
  width,
  flex,
  colorMode,
  data,
  shrink,
  size,
  variant,
  readOnly,
  noPaddingTop,
  name,
  error,
  helperText,
  ...rest
}: any) {
  const styledTheme = useTheme();

  const [list, setList] = useState([]);

  useEffect(() => {
    setList(options);
  }, [options]);

  const disableOptions = (option: any, _value: any) => {
    let isSelected = false;

    data?.map((item: any) => item.shiftweek === _value && (isSelected = true));

    return isSelected || option === null || option === '' || option === 999;
  };

  const ITEM_HEIGHT = 48;

  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 300,
      },
    },
  };

  return (
    <InputControl
      fullWidth={fullWidth}
      flex={flex}
      variant={variant ? variant : 'filled'}
      size={size}
      width={width}
      no_padding_top={noPaddingTop?.toString()}
    >
      <InputLabel error={error} id={id} shrink={shrink}>
        {label}
      </InputLabel>

      <SelectMUI
        readOnly={readOnly}
        id={id}
        labelId={id}
        value={value}
        onChange={onChange}
        color_mode={colorMode}
        size={size}
        name={name}
        error={error}
        styled_theme={styledTheme}
        {...rest}
        MenuProps={MenuProps}
        displayEmpty
      >
        {list?.map((option: any) => (
          <Option
            key={option}
            value={option}
            color_mode={colorMode}
            disabled={disableOptions(option, option)}
            styled_theme={styledTheme}
          >
            {option}
          </Option>
        ))}
      </SelectMUI>
      {error ? (
        <HelperText styled_theme={styledTheme} error={error}>
          {helperText}
        </HelperText>
      ) : null}
    </InputControl>
  );
}
