import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useAuthGlobal } from '../../../context/AuthProvider/useAuthGlobal';

import { Overlay, Actions, ContainerLogout } from '../../../styles/litlemodal';
import { ButtonMain } from '../../Button/ButtonMain';
import { ModalProps } from './types';

export function ModalLogout({ isModalActive, closeModal }: ModalProps) {
  const modalRoot = document.getElementById('modal') as HTMLElement;
  const { t } = useTranslation();

  const { Logout } = useAuthGlobal();

  function handleLogout() {
    Logout(false);
  }

  if (!isModalActive) {
    return null;
  }

  return ReactDOM.createPortal(
    <Overlay>
      <ContainerLogout>
        <button className="close-icon" onClick={closeModal}>
          &#10006;
        </button>
        <div className="text-group">
          <h1>{t('modal-logout')}</h1>
        </div>
        <Actions>
          <ButtonMain
            label={t('button-no')}
            secondaryStyle={true}
            onClick={closeModal}
          />
          <ButtonMain
            label={t('button-yes')}
            onClick={() => {
              closeModal();
              handleLogout();
            }}
          />
        </Actions>
      </ContainerLogout>
    </Overlay>,
    modalRoot,
  );
}
