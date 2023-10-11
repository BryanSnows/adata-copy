import Backdrop from '@mui/material/Backdrop';

import { CircularProgressStyled } from './styles';

export function CircularProgressPortal() {
  return (
    <Backdrop
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 100,
      }}
      open={true}
    >
      <CircularProgressStyled disableShrink size={'12rem'} />
    </Backdrop>
  );
}
