import styled from 'styled-components';
import { Switch } from '@mui/material';

export const SwitchStyled = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#40A731',
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#40A731',
  },
}));
