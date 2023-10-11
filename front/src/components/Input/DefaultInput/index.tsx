import InputAdornment from '@material-ui/core/InputAdornment';
import { IconButton, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { DefaultInputProps } from './DefaultInputProps';

export function DefaultInput({
  label,
  width,
  error,
  isMultiline,
  shrink,
  rows,
  small,
  line,
  adornment,
  type,
  toggleShowPassword,
  showPassword,
  ...rest
}: DefaultInputProps) {
  const useWidth = width;

  const inputProps = {
    ...rest,
  };

  const isPassword = showPassword ? 'text' : 'password';

  const InputIcon = () => {
    return showPassword ? <Visibility /> : <VisibilityOff />;
  };

  return (
    <>
      <TextField
        type={type === 'password' ? isPassword : type}
        label={label}
        variant="filled"
        rows={rows}
        sx={{
          '& label.Mui-focused': {
            color: '#04318D',
          },
          '& .MuiInputBase-root:after': {
            borderBottomColor: '#04318D',
          },
          '& .MuiInputBase-root:before': {
            border: 'none',
          },
          '& .MuiFormLabel-root.Mui-error': {
            color: '#B00020 !important',
          },
          '& .MuiInputBase-root.Mui-error:after': {
            borderBottomColor: '#B00020 !important',
          },
          '&&& .MuiFilledInput-root:before': {
            border: line,
          },
        }}
        style={{ width: useWidth }}
        error={error ? true : false}
        inputProps={inputProps}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {type !== 'password' ? (
                adornment
              ) : (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={toggleShowPassword}
                  edge="end"
                >
                  <InputIcon />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
        multiline={isMultiline}
        InputLabelProps={{ shrink }}
        size={small ? 'small' : 'medium'}
      />
    </>
  );
}
