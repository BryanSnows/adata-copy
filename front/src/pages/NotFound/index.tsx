import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ButtonMain } from '../../components/Button/ButtonMain';
import { Container } from './styles';

export function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Container>
      <h1>404 NotFound</h1>
      <h4>{t('button-home')}</h4>

      <ButtonMain
        label={t('button-home')}
        width="14rem"
        onClick={() => navigate('/')}
      />
    </Container>
  );
}
