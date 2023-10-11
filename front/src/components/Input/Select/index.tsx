import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import { SelectProps } from './SelectProps';
import { useTranslation } from 'react-i18next';

interface Option {
  id: number;
  value: string;
}

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export function Select({
  id,
  width,
  placeholder,
  label,
  _errorLabel,
  values,
  currentValue,
  disabled,
  double,
  text,
  onChangeValue,
  ...rest
}: SelectProps) {
  const useWidth = width;

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly Option[]>([]);
  const loading = open && options.length === 0;
  const { t } = useTranslation();

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(100);

      if (active) {
        const array = [...values];
        setOptions(array);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      id={id}
      noOptionsText={t('component-select-no-options')}
      loadingText={t('component-select-loading')}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={(_e) => {
        setOpen(false);
      }}
      disabled={disabled}
      sx={{
        '&&& .MuiFilledInput-root:before': {
          border: 'none',
        },
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={
        double
          ? (option) => `${option.id} - ${option.value}`
          : (option) => `${t(`${option.value}`)}`
      }
      options={options}
      loading={loading}
      value={!disabled ? currentValue : { id: ' ', value: ' ' }}
      onChange={(_e, newValue) => onChangeValue && onChangeValue(newValue)}
      style={{ width: useWidth }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="filled"
          label={label}
          placeholder={placeholder}
          sx={{
            '& label.Mui-focused': {
              color: '#04318D',
            },
            '& .MuiInputBase-root:after': {
              borderBottomColor: '#04318D',
            },
            // '& .MuiInputBase-root:before': {
            //   border: 'none',
            // },
            '& .Mui-error': {
              color: '#B00020 !important',
            },
            '& .MuiInputBase-root.Mui-error:after': {
              borderBottomColor: '#B00020 !important',
            },
            background: 'rgb(252, 252, 252)',
          }}
          {...rest}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
