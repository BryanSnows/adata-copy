import { Box, ContainerCalendar } from './styles';
import { ReactComponent as Close } from '../../assets/icons/x.svg';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import enUS from 'date-fns/locale/en-US';
import ptBR from 'date-fns/locale/pt-BR';

import {
  LocalizationProvider,
  PickersDay,
  StaticDatePicker,
} from '@mui/x-date-pickers';

import { ICalendar } from './types';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { startOfDay } from 'date-fns';
import { useEffect, useState } from 'react';
import { formatDate } from '../../utils/formatParams/formatDate';

import CalendarIcon from '@mui/icons-material/Event';

export function Calendar({
  value,
  setDatePicker,
  label,
  width,
  line,
  interval,
  initial,
  placeholder,
  onChange,
}: ICalendar) {
  const [InputValue, setInputValue] = useState('');
  const [isOpenCalendar, setIsOpenCalendar] = useState(false);
  const useWidth = width;
  const language = localStorage.getItem('language');

  const min = new Date(value[0]);
  min.setDate(min.getDate() - 14);
  const max = new Date(value[0]);
  max.setDate(max.getDate() + 14);
  const today = new Date();

  //Fechar automaticamente quando selecionar a segunda data:

  useEffect(() => {
    if (value.length === 0 && initial) {
      setInputValue(
        `${formatDate(initial[0], true)} - ${formatDate(initial[1], true)}`,
      );
    }

    if (value.length === 2) {
      setIsOpenCalendar(false);
    }
  }, [value]);

  const findIndexDate = (dates, date) => {
    const dateTime = date.getTime();
    return dates.findIndex((item) => item.getTime() === dateTime);
  };

  function handleDate(newValue) {
    const array = [...value];
    const date = startOfDay(newValue);
    const index = findIndexDate(array, date);

    if (index >= 0) {
      array?.splice(index, 1);
    } else {
      array.push(date);
    }

    if (array.length < 3) {
      array?.sort(function (a, b) {
        return a.getTime() - b.getTime();
      });
      setDatePicker(array);
      setInputValue(`${formatDate(array[0])} - ${formatDate(array[1])}`);
    }
  }

  const findDate = (dates, date) => {
    const dateTime = date.getTime();
    return dates.find((item) => item.getTime() === dateTime);
  };

  const renderPickerDay = (date, selectedDates, pickersDayProps) => {
    if (!value) {
      return <PickersDay {...pickersDayProps} disabled />;
    }
    const selected = findDate(value, date);

    return (
      <PickersDay {...pickersDayProps} disableMargin selected={selected} />
    );
  };

  const handleViewModal = () => {
    setIsOpenCalendar((prevState) => !prevState);
  };

  const handleClearCalendar = () => {
    setInputValue('');
    setDatePicker([]);
    if (onChange) onChange();
  };

  return (
    <ContainerCalendar>
      <TextField
        id={label}
        label={label}
        variant="filled"
        value={InputValue}
        type="text"
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
          '&&& .MuiFilledInput-root:before': {
            border: line,
          },
          background: 'rgb(252, 252, 252)',
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              {InputValue && (
                <IconButton onClick={handleClearCalendar}>
                  <Close />
                </IconButton>
              )}
              <IconButton onClick={handleViewModal}>
                <CalendarIcon />
              </IconButton>
            </InputAdornment>
          ),
          readOnly: true,
          /* disableUnderline: true, */
        }}
        // InputLabelProps={{ shrink: true }}
        style={{ width: useWidth }}
      />

      {isOpenCalendar ? (
        <Box>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            locale={language === 'ptBR' ? ptBR : enUS}
          >
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              value={value}
              onChange={handleDate}
              renderDay={renderPickerDay}
              minDate={interval ? min : ''}
              maxDate={interval && max < today ? max : today}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Box>
      ) : null}
    </ContainerCalendar>
  );
}
