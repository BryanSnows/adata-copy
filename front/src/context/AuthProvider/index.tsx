import { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import { IAuthContext, IAuthProvider } from './types';
import {
  getCountLocalStorage,
  getProfileLocalStorage,
  getTokenLocalStorage,
  getUserNameLocalStorage,
  setCountLocalStorage,
} from './utils';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export function AuthProvider({ children }: IAuthProvider) {
  const [userName, setUserName] = useState<string>('');
  const [profile, setProfile] = useState<string>('');
  const [userValidation, setUserValidation] = useState(false);
  const [mensageError, setMensageError] = useState<string>('');
  const [errorLogin, setErrorLogin] = useState<string>('');
  const [mensageAttempts, setMensageAttempts] = useState<string>('');
  const [newPassword, setNewPassword] = useState<boolean>(false);
  const [firstPassword, setFirstPassword] = useState<string>('');
  const { t } = useTranslation();

  const { handleLogin } = useAuth(
    setMensageError,
    setMensageAttempts,
    setErrorLogin,
    setNewPassword,
    setFirstPassword,
  );

  const tokenByLocalStorage = getTokenLocalStorage();

  const navigate = useNavigate();

  useEffect(() => {
    const count = getCountLocalStorage();

    if (tokenByLocalStorage) {
      setUserName(getUserNameLocalStorage());
      setProfile(getProfileLocalStorage());
      setUserValidation(true);
    }

    if (count === null) {
      setCountLocalStorage(1);
    }
  }, [tokenByLocalStorage]);

  function Logout(logged: boolean) {
    localStorage.clear();
    setCountLocalStorage(1);
    localStorage.setItem('is_logged_in', 'false');
    navigate('/login');

    if (!logged) {
      toast.success(`${t('toast-logout')}`);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        mensageError,
        mensageAttempts,
        handleLogin,
        setMensageError,
        setMensageAttempts,
        userName,
        profile,
        errorLogin,
        Logout,
        newPassword,
        setNewPassword,
        firstPassword,
        userValidation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
