import Modal from '@mui/material/Modal';
import { makeStyles } from '@material-ui/core';
import { Wrapper } from './styles';

interface ModalBaseProps {
  isModalOpen: boolean;
  onRequestClose: () => void;
  children: JSX.Element;
  active: boolean;
}

const useStyles = makeStyles(() => ({
  backDrop: {
    backdropFilter: 'blur(6px)',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
}));

export function ModalBase({
  isModalOpen,
  onRequestClose,
  children,
  active,
}: ModalBaseProps) {
  const classes = useStyles();

  return (
    <Modal
      BackdropProps={{
        classes: {
          root: classes.backDrop,
        },
      }}
      open={isModalOpen}
      onClose={onRequestClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Wrapper>
        <div className="close-icon" onClick={onRequestClose}>
          {active ? '' : <button>&#10006;</button>}
        </div>
        {children}
      </Wrapper>
    </Modal>
  );
}
