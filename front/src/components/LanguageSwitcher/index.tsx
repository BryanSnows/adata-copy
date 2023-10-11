import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import br from './assets/br.svg';
import us from './assets/us.svg';
import { Toggle, ToggleContainer } from './styles';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const language = localStorage.getItem('language');

  useEffect(() => {
    if (!language) {
      i18n.changeLanguage('ptBR');
      localStorage.setItem('language', 'ptBR');
    } else {
      i18n.changeLanguage(language === 'ptBR' ? language : 'en');
    }
  }, [language]);

  useEffect(() => {
    if (window.location.pathname === '/login') {
      localStorage.setItem('language', 'ptBR');
      i18n.changeLanguage('ptBR');
    }
  }, []);

  return (
    <ToggleContainer>
      <Toggle isActive={language === 'en'}>
        <button
          key={'en'}
          onClick={() => {
            localStorage.setItem('language', 'en');
            i18n.changeLanguage('en');
          }}
        >
          <img src={us} alt={'English'} />
        </button>
      </Toggle>
      <Toggle isActive={language === 'ptBR'}>
        <button
          key={'ptBR'}
          onClick={() => {
            localStorage.setItem('language', 'ptBR');
            i18n.changeLanguage('ptBR');
          }}
        >
          <img src={br} alt={'Português'} />
        </button>
      </Toggle>
    </ToggleContainer>
  );
};
