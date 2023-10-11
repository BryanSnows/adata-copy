import { IUser } from "../../../../interfaces/IGlobal";

export type ModalProps = {
  isModalActive: boolean;
  handleCancel: () => void;
  user: IUser;
};
