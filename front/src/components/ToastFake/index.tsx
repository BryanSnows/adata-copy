import { Box, BoxIcon, Divider } from './style';
import { ReactComponent as Alert } from '../../assets/icons/alert.svg';
import { ReactComponent as X } from '../../assets/icons/x.svg';
import { IToastFake } from './types';

export function ToastFake({ mensage, onClose }: IToastFake) {
  return (
    <>
      <Box>
        <BoxIcon>
          <Alert />
        </BoxIcon>
        {mensage}
        <BoxIcon>
          <Divider />
          <button onClick={() => onClose && onClose()}>
            <X />
          </button>
        </BoxIcon>
      </Box>
    </>
  );
}
