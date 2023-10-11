import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  styled as styledMui,
} from '@mui/material';

export const SelectMUI = styledMui(Select)<any>(() => ({
  '&&': {
    border: 'none',

    //fontWeight: color_mode && "bold",
  },

  '&&& .MuiFilledInput-input': {
    paddingTop: ({ size }: any) => size === 'small' && '10px',
  },

  '&&& .MuiFilledInput-root:before': {
    border: 'none',
  },
}));

export const InputControl = styledMui(FormControl)<any>(
  ({ size, no_padding_top, flex, width }: any) => ({
    ...(width
      ? {
          width: width ? width : 'auto',
        }
      : {
          flex: flex ? flex : 'auto',
        }),

    paddingTop: size === 'small' && no_padding_top === 'false' ? '10px' : '0px',

    '&&& .MuiInputBase-root:before': {
      border: 'none',
      flex: 1,
    },

    '&&& .MuiFormControl-root': {
      paddingTop: '0px',
    },
  }),
);

export const Option = styledMui(MenuItem)<any>(
  ({ styled_theme, _value }: any) => ({
    '&&': {
      color: () => {
        if (_value === 1) return styled_theme.colors.success.main;
        if (_value === 2) return styled_theme.colors.error.main;
      },
    },
  }),
);

export const HelperText = styledMui(FormHelperText)<any>(
  ({ styled_theme, error }) => ({
    color: error
      ? styled_theme.colors.error.main
      : styled_theme.colors.text.main,

    textAlign: 'start',
    margin: '0px 0px 0px 3px',
    overflow: 'hidden !important',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }),
);
