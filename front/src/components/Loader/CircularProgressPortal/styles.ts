import CircularProgress from '@mui/material/CircularProgress';
import styled from 'styled-components';

export const CircularProgressStyled = styled(CircularProgress)(({ theme }) => ({
  '& .MuiCircularProgress-svg': {
    color: theme.colors.primary.main,
  },
}));
