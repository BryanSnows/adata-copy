import ReactDOM from 'react-dom';
import { ModalProps } from './types';
import {
  ContainerLogout,
  Overlay,
  Actions,
} from '../../../../styles/litlemodal';
import { ButtonMain } from '../../../../components/Button/ButtonMain';
import Api from '../../../../services/Api';
import { toast } from 'react-toastify';
import { IUser } from '../../../../interfaces/IGlobal';
import { useTranslation } from 'react-i18next';

export const ModalResetPass = ({
  isModalActive,
  handleCancel,
  user,
}: ModalProps) => {
  const modalRoot = document.getElementById('modal') as HTMLElement;
  const { t } = useTranslation();

  if (!isModalActive) {
    return null;
  }

  async function handleResetPassword(user: IUser) {
    Api.patch(`user/resetPass/${user.user_enrollment}`)
      .then((res) => {
        toast.success(t('toast-reset-sucess'));
        handleCancel();
      })
      .catch(() => toast.error(t('toast-reset-error')));
  }

  return ReactDOM.createPortal(
    <Overlay>
      <ContainerLogout>
        <button className="close-icon" onClick={handleCancel}>
          &#10006;
        </button>
        <div className="text-group">
          <h1>{t('modal-reset')}</h1>
        </div>
        <Actions>
          <ButtonMain
            label={t('button-no')}
            secondaryStyle={true}
            onClick={handleCancel}
          />
          <ButtonMain
            label={t('button-yes')}
            onClick={() => {
              handleResetPassword(user);
            }}
          />
        </Actions>
      </ContainerLogout>
    </Overlay>,
    modalRoot,
  );
};
