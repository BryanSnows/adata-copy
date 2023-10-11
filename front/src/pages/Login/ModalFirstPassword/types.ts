export type ModalProps = {
  isModalActive: boolean;
  closeModal: () => void;
  firstPassword?: string;
  keyId?: number;
};

export interface ITextColor {
  characters: string;
  minNumber: string;
  minCharactersSpecial: string;
  minLet: string;
}
