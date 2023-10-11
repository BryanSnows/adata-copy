import { Header, Container, ContainerCentral, Name } from './styles';
import Cell from '..//../assets/components/cell';
import { useAuthGlobal } from '../../context/AuthProvider/useAuthGlobal';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import jwtDecode from 'jwt-decode';
import { useEffect } from 'react';

export function Home() {
  const { userName, Logout } = useAuthGlobal();
  const { t } = useTranslation();

  const token = localStorage.getItem('acc_token');

  useEffect(() => {
    function isTokenValid(token) {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    }

    const logged = isTokenValid(token);

    if (!logged) {
      toast.info(t('toast-expired'));
      setTimeout(() => {
        Logout(true);
      }, 3500);
    }
  }, []);

  return (
    <Container>
      <Header />
      <ContainerCentral>
        <Name id="welcome">
          <h1>
            {t('home-hello')},
            <br /> {`${userName}!`}
          </h1>
          <h4>
            {t('home-welcome')} <br /> {t('home-cell')}
            <br /> {t('home-test-mst')}
          </h4>
        </Name>
        <Cell />
      </ContainerCentral>
    </Container>
  );
}
