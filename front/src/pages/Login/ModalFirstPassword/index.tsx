import { ITextColor, ModalProps } from './types';
import { toast } from 'react-toastify';
import ReactDOM from 'react-dom';
import { ModalConfirm } from '../../../components/Modal/ModalConfirm';
import { ChangeEvent, useState } from 'react';
import { Container, Form, Overlay, Text, TextH5, Title } from './styles';
import { DefaultInput } from '../../../components/Input/DefaultInput';
import { ButtonMain } from '../../../components/Button/ButtonMain';
import Api from '../../../services/Api';
import { useTranslation } from 'react-i18next';
import { Enter } from '../styles';

export function ModalFirstPassword({
  isModalActive,
  closeModal,
  firstPassword,
}: ModalProps) {
  const modalRoot = document.getElementById('modal') as HTMLElement;
  const { t } = useTranslation();

  const [newPassword, setNewPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const [textColor, setTextColor] = useState<ITextColor>({
    characters: '',
    minNumber: '',
    minCharactersSpecial: '',
    minLet: '',
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [confirmPassword, setConfirmPassword] = useState<boolean>(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirmPassword = () => {
    setConfirmPassword(!confirmPassword);
  };

  function handleCancelModal() {
    setIsModalConfirmOpen(false);
  }

  function handleCloseModal() {
    closeModal();
    setIsModalConfirmOpen(false);
  }

  if (!isModalActive) {
    return null;
  }
  const regexCharactersSpecial = /\W|_/;
  const regexNumber = /\d/;
  const regex_alf = /[ a-zA-Z áéíóúâÁÉÍÓÚâêôÂÊÔÃã]/;

  const isFormValid =
    newPassword === repeatPassword &&
    regexCharactersSpecial.test(repeatPassword) &&
    regexNumber.test(repeatPassword) &&
    regex_alf.test(repeatPassword) &&
    newPassword.length >= 6 &&
    repeatPassword.length >= 6;

  function handleNewPassword(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value.replace(/\s/g, '');

    setNewPassword(value);

    if (value.length === 0) {
      setTextColor(() => ({
        characters: '',
        minNumber: '',
        minCharactersSpecial: '',
        minLet: '',
      }));
    } else if (value.length < 6) {
      setTextColor(() => ({
        characters: '#FF003D',
        minNumber: '#FF003D',
        minCharactersSpecial: '#FF003D',
        minLet: '#FF003D',
      }));
    } else if (value.length >= 6) {
      setTextColor((prevState) => ({
        ...prevState,
        characters: '#05A763',
      }));
    }

    if (regexCharactersSpecial.test(value)) {
      setTextColor((prevState) => ({
        ...prevState,
        minCharactersSpecial: '#05A763',
      }));
    }

    if (regex_alf.test(value)) {
      setTextColor((prevState) => ({
        ...prevState,
        minLet: '#05A763',
      }));
    }
    if (regexNumber.test(value)) {
      setTextColor((prevState) => ({
        ...prevState,
        minNumber: '#05A763',
      }));
    }
  }

  function handleRepeatPassword(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value.replace(/\s/g, '');
    setRepeatPassword(value);
  }

  async function handleSubmit() {
    const body = {
      current_password: firstPassword,
      new_password: newPassword,
      confirmation_password: repeatPassword,
    };

    await Api.post('auth/first_access', body)
      .then(() => {
        toast.success(t('toast-save-pass'));
        handleCloseModal();
        setNewPassword('');
        setRepeatPassword('');
        setTextColor(() => ({
          characters: '',
          minNumber: '',
          minCharactersSpecial: '',
          minLet: '',
        }));
        localStorage.removeItem('first_acc');
      })
      .catch((error) => {
        const code = error.response.data.code;
        const object = error.response.data.object;
        toast.error(t(`${object}`) + t(`${code}`));
        setNewPassword('');
        setRepeatPassword('');
        setTextColor(() => ({
          characters: '',
          minNumber: '',
          minCharactersSpecial: '',
          minLet: '',
        }));
      });
  }

  return ReactDOM.createPortal(
    <Overlay>
      <ModalConfirm
        isModalActive={isModalConfirmOpen}
        handleCancel={handleCancelModal}
        handleClose={handleCloseModal}
      />
      <Container>
        <Title>
          <button
            className="close-icon"
            onClick={() => {
              setIsModalConfirmOpen(true);
              setNewPassword('');
              setRepeatPassword('');
              setTextColor(() => ({
                characters: '',
                minNumber: '',
                minCharactersSpecial: '',
                minLet: '',
              }));
            }}
          >
            &#10006;
          </button>
          <h1>{t('modal-new-pass')}</h1>
        </Title>
        <Form
          onSubmit={(e: any) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Text>
            <TextH5>{t('modal-new-pass-h5')}</TextH5>
            <TextH5 color={textColor.characters}>
              {t('modal-new-pass-characters')}
            </TextH5>
            <TextH5 color={textColor.minNumber}>{t('validation-n')}</TextH5>
            <TextH5 color={textColor.minCharactersSpecial}>
              {t('validation-special')}
            </TextH5>
            <TextH5 color={textColor.minLet}>{t('validation-let')}</TextH5>
          </Text>

          <DefaultInput
            width="328px"
            height="78px"
            type="password"
            name="password"
            label={t('input-new-pass')}
            id="NovaSenha"
            autoComplete="off"
            toggleShowPassword={handleShowPassword}
            showPassword={showPassword}
            value={newPassword}
            onChange={handleNewPassword}
            maxLength={12}
          />

          <DefaultInput
            width="328px"
            height="78px"
            name="passwordConfirm"
            type="password"
            label={t('input-confirm')}
            id="ConfirmarSenha"
            autoComplete="off"
            toggleShowPassword={handleConfirmPassword}
            showPassword={confirmPassword}
            value={repeatPassword}
            onChange={handleRepeatPassword}
            maxLength={12}
          />
          <Enter>
            <ButtonMain
              width="135px"
              type="submit"
              label={t('button-save')}
              height="48px"
              disabled={!isFormValid}
            />
          </Enter>
        </Form>
      </Container>
    </Overlay>,
    modalRoot,
  );
}
