import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { getRefreshToken } from '../context/AuthProvider/services';
import {
  setRefreshTokenLocalStorage,
  setTokenLocalStorage,
} from '../context/AuthProvider/utils';

const language = localStorage.getItem('language');

const exist =
  language === 'ptBR' ? 'Sua sessão expirou!' : 'Your session has expired!';

const Api = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/v1`,
});

Api.interceptors.request.use((request: any) => {
  const token =
    localStorage.getItem('acc_token') ||
    localStorage.getItem('first_acc') ||
    '';

  if (token) {
    request.headers.common.Authorization = `Bearer ${token.toString()}`;
  }

  return request;
});

Api.interceptors.response.use(
  async (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const pathsToExclude = ['auth/login', 'auth/first_access'];
    if (
      error.response?.status === 401 &&
      !pathsToExclude.includes(error.response.config.url)
    ) {
      const originalRequest = error.config;

      return await getRefreshToken()
        .then((res) => {
         
          setTokenLocalStorage(res.data.access_token);
          setRefreshTokenLocalStorage(res.data.refresh_token);
          return Api(originalRequest);
        })
        .catch(() => {
          localStorage.clear();
       
          toast.info(exist, {
            toastId: 'LOGOUT_USER',
          });
          setTimeout(() => {
            window.location.href = '/';
          }, 3500);
        });
    }

    return Promise.reject(error);
  },
);

export default Api;
