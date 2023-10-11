import ReactDOM from 'react-dom';

import { ButtonMain } from '../../Button/ButtonMain';
import { Overlay, Actions, ContainerConfirm } from '../../../styles/litlemodal';
import { ModalProps } from './types';
import { useTranslation } from 'react-i18next';
import { ReactComponent as Alert } from '../../../assets/icons/slots.svg';

export const ModalConfirm = ({
  isModalActive,
  handleCancel,
  handleClose,
  title,
  message,
  icon,
}: ModalProps) => {
  const modalRoot = document.getElementById('modal') as HTMLElement;
  const { t } = useTranslation();

  if (!isModalActive) {
    return null;
  }

  return ReactDOM.createPortal(
    <Overlay>
      <ContainerConfirm
        style={{ width: icon ? 490 : 408, height: icon ? 350 : 300 }}
      >
        <button className="close-icon" onClick={handleCancel}>
          &#10006;
        </button>
        <div>{icon ? <Alert style={{ width: 50, height: 50 }} /> : null}</div>
        <div className="text-group">
          {title ? <h1>{title}</h1> : <h1>{t('modal-confirm')}</h1>}
          {message ? <p>{message}</p> : <p>{t('modal-confirm-not-save')}</p>}
        </div>
        <Actions>
          <ButtonMain
            label={t('button-no')}
            secondaryStyle={true}
            onClick={handleCancel}
          />
          <ButtonMain label={t('button-yes')} onClick={handleClose} />
        </Actions>
      </ContainerConfirm>
    </Overlay>,
    modalRoot,
  );
};
