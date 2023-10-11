import { Checkbox } from '@mui/material';
import { CheckBoxProps } from './types';

export function CheckBox({
  isChecked,
  transactionNumber,
  onChange,
}: CheckBoxProps) {
  const label = {
    inputProps: {
      'aria-label': 'Checkbox demo',
      'data-transaction': transactionNumber,
    },
  };
  return (
    <>
      <Checkbox
        {...label}
        key={`slider-${isChecked}`}
        defaultChecked={isChecked}
        value={isChecked ? 'on' : ''}
        onChange={onChange}
        sx={{
          color: '#40A7314',
          '&.Mui-checked': {
            color: '#40A731',
          },
        }}
      />
    </>
  );
}
