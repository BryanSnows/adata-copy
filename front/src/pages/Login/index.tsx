import { ChangeEvent, useEffect, useState } from 'react';

import {
  B,
  Banner,
  Box,
  BoxLanguage,
  BoxLogin,
  Container,
  Form,
  Enter,
} from './styles';

import innovating from '../../assets/icons/innovating.svg';
import mst from '../../assets/images/mst.png';

import { DefaultInput } from '../../components/Input/DefaultInput';
import { ButtonMain } from '../../components/Button/ButtonMain';
import { formatToOnlyNumbers } from '../../utils/formatToOnlyNumber';

import { useAuthGlobal } from '../../context/AuthProvider/useAuthGlobal';
import { ToastFake } from '../../components/ToastFake';
import { ModalFirstPassword } from './ModalFirstPassword';
import { FormGroup } from '../../components/FormGroup';
import { useErrors } from '../../context/hooks/useErrors';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';

export function Login() {
  const [enrollment, setEnrollment] = useState<string>('');
  const [password, setPassoword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleLogin,
    mensageError,
    mensageAttempts,
    setMensageError,
    setMensageAttempts,
    errorLogin,
    newPassword,
    setNewPassword,
    firstPassword,
  } = useAuthGlobal();

  const isFormValid = enrollment.length >= 6 && password.length >= 6;

  const { setError, removeError, getErrorMessageByFieldName } = useErrors();
  const { t } = useTranslation();
  const language = localStorage.getItem('language');

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  function handleEnrollment(event: ChangeEvent<HTMLInputElement>) {
    const value = formatToOnlyNumbers(event.target.value);

    setEnrollment(value);
  }

  function handlePassword(event: ChangeEvent<HTMLInputElement>) {
    setPassoword(event.target.value.replace(/\s/g, ''));
  }

  useEffect(() => {
    if (errorLogin) {
      setError({
        field: `${language === 'ptBR' ? 'errorLoginPt' : 'errorLoginEn'}`,
        message: `${t('toast-error-pass')}`,
      });
    } else if (errorLogin.length === 0) {
      removeError(`${language === 'ptBR' ? 'errorLoginPt' : 'errorLoginEn'}`);
    }
  }, [errorLogin, language]);

  return (
    <Container>
      <ModalFirstPassword
        isModalActive={newPassword}
        closeModal={() => {
          setNewPassword(!newPassword);
          setEnrollment('');
          setPassoword('');
          setShowPassword(false);
        }}
        firstPassword={firstPassword}
      />
      <Box>
        <Banner>
          <img src={innovating} alt="banner" width="100%" height="100%" />
        </Banner>
      </Box>
      <BoxLogin>
        <BoxLanguage>
          <LanguageSwitcher />
        </BoxLanguage>
        <img src={mst} alt="mst" width={302} />
        <Form
          onSubmit={(e: any) => {
            e.preventDefault();
            handleLogin(enrollment, password);

            let clearToast = window.setTimeout(() => {
              setMensageError('');
              setMensageAttempts('');
            }, 3500);

            window.clearTimeout(clearToast);

            clearToast = window.setTimeout(() => {
              setMensageError('');
              setMensageAttempts('');
            }, 3500);
          }}
        >
          <FormGroup
            error={getErrorMessageByFieldName(
              `${language === 'ptBR' ? 'errorLoginPt' : 'errorLoginEn'}`,
            )}
            extraErrorMessage={['']}
          >
            <DefaultInput
              error={errorLogin}
              width="450px"
              height="78px"
              id="login"
              label={t('input-enrollment')}
              value={enrollment}
              onChange={handleEnrollment}
              maxLength={8}
            />
          </FormGroup>

          <FormGroup
            error={getErrorMessageByFieldName(
              `${language === 'ptBR' ? 'errorLoginPt' : 'errorLoginEn'}`,
            )}
            extraErrorMessage={['']}
          >
            <DefaultInput
              error={errorLogin}
              type="password"
              width="450px"
              label={t('input-pass')}
              id="password"
              toggleShowPassword={handleShowPassword}
              showPassword={showPassword}
              value={password}
              onChange={handlePassword}
              maxLength={12}
            />
          </FormGroup>
          {mensageError ? (
            <ToastFake
              mensage={mensageError}
              onClose={() => setMensageError('')}
            />
          ) : (
            <Enter>
              <ButtonMain
                width="450px"
                type="submit"
                label={t('button-enter')}
                height="54px"
                disabled={!isFormValid}
              />
              <h5>
                {t('login-for')} <B>{t('login-reset')}</B> {t('login-adm')}
              </h5>
            </Enter>
          )}
        </Form>

        {mensageAttempts && mensageError && (
          <ToastFake
            mensage={mensageAttempts}
            onClose={() => {
              setMensageAttempts('');
              setMensageError('');
            }}
          />
        )}
      </BoxLogin>
    </Container>
  );
}
