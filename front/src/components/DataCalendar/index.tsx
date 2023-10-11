import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ReactComponent as Close } from '../../assets/icons/x.svg';
import { ReactComponent as Calendar } from '../../assets/icons/calendar.svg';

import ptBR from 'date-fns/locale/pt-BR';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { TextField, IconButton } from '@mui/material';
import enUS from 'date-fns/locale/en-US';
import { IData } from './types';

export function BasicDatePicker({
  value,
  setDatePicker,
  label,
  width,
  line,
  clean,
  onChangeValue,
}: IData) {
  const useWidth = width;
  const today = new Date();
  const language = localStorage.getItem('language');

  const onKeyDown = (e) => {
    e.preventDefault();
  };

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      locale={language === 'ptBR' ? ptBR : enUS}
    >
      <DesktopDatePicker
        label={label}
        value={value}
        maxDate={today}
        onChange={(newValue) => onChangeValue && onChangeValue(newValue)}
        components={{
          OpenPickerIcon: Calendar,
        }}
        renderInput={(params) => (
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TextField
              {...params}
              variant="filled"
              onKeyDown={onKeyDown}
              sx={{
                '& label.Mui-focused': {
                  color: '#04318D',
                },
                '& .MuiInputBase-root:after': {
                  borderBottomColor: '#04318D',
                },

                '&&& .MuiFilledInput-root:before': {
                  border: line,
                },
                background: 'rgb(252, 252, 252)',
              }}
              style={{ width: useWidth }}
            />
            {value && !clean && (
              <IconButton
                onClick={(newValue) => setDatePicker && setDatePicker(newValue)}
                sx={{
                  position: 'absolute',
                  right: 30,
                }}
              >
                <Close />
              </IconButton>
            )}
          </div>
        )}
      />
    </LocalizationProvider>
  );
}
