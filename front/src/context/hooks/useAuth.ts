import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Api from '../../services/Api';

import {
  getCountLocalStorage,
  setCountLocalStorage,
  setProfileLocalStorage,
  setRefreshTokenLocalStorage,
  setTokenFirstLocalStorage,
  setTokenLocalStorage,
  setUserNameLocalStorage,
} from '../AuthProvider/utils';

export function useAuth(
  setMensageError,
  setMensageAttempts,
  setErrorLogin,
  setNewPassword,
  setFirstPassword,
) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const language = localStorage.getItem('language');

  async function handleLogin(user: string, password: string) {
    const count = getCountLocalStorage();

    const body = {
      enrollment: user,
      password: password,
    };

    await Api.post('auth/login', body)
      .then((response) => {
        if (response.data.first_access_token) {
          setTokenFirstLocalStorage(response.data.first_access_token);
          setNewPassword(true);
          setFirstPassword(password);
          localStorage.removeItem('count');
          localStorage.removeItem('user');
          setErrorLogin('');
        } else {
          setTokenLocalStorage(response.data.access_token);
          setRefreshTokenLocalStorage(response.data.refresh_token);
          setUserNameLocalStorage(response.data.name);
          setProfileLocalStorage(response.data.profile.profile_name);
          localStorage.setItem('is_logged_in', 'true');
          localStorage.removeItem('count');
          localStorage.removeItem('user');
          setErrorLogin('');
          navigate('/home');
        }
      })
      .catch(async (error) => {
        if ([400, 404, 410].includes(error.request.status)) {
          const code = error.response.data.code;
          const object = error.response.data.object;

          setMensageError(
            language === 'ptBR'
              ? t(`${object}`) + t(`${code}`)
              : t(`${code}`) + ` ${t(`${object}`)}`,
          );
          setMensageAttempts('');
          setCountLocalStorage(1);
          if (error.request.status !== 400) {
            setErrorLogin('true');
          } else {
            setErrorLogin('');
          }
        } else if (
          JSON.parse(localStorage.getItem('user')) === user &&
          count < 3
        ) {
          setCountLocalStorage(count + 1);
          setMensageError(t('toast-error-pass'));
          setMensageAttempts(
            `${t('login-you-are')} ${3 - count} ${t('login-try')}`,
          );

          setErrorLogin('true');
        } else if (
          JSON.parse(localStorage.getItem('user')) === user &&
          count === 3
        ) {
          await Api.patch(`user/passwordStatus/${user}`);
          setMensageError(t('login-block'));
          setMensageAttempts('');
          setCountLocalStorage(1);
          setErrorLogin('true');
        } else {
          localStorage.setItem('user', JSON.stringify(user));
          setCountLocalStorage(2);
          setErrorLogin('true');
          setMensageError(t('toast-error-pass'));
          setMensageAttempts(`${t('login-you-are')} ${2} ${t('login-try')}`);
        }
      });
  }

  return { handleLogin };
}
