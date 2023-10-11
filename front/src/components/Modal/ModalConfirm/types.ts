export type ModalProps = {
  isModalActive: boolean;
  handleCancel: () => void;
  handleClose: () => void;
  title?: string;
  message?: string;
  icon?: boolean;
};
