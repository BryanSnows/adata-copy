import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { GlobalStyles } from '../../assets/styles/global';
import { StyledToast } from '../../assets/styles/toastStyles';
import { AuthProvider } from '../../context/AuthProvider';
import { Routes } from '../../routes';
import { theme } from '../../assets/styles/themes/theme';
import { ThemeProvider } from 'styled-components';
import { useEffect } from 'react';
import { getTokenLocalStorage } from '../../context/AuthProvider/utils';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  const tokenByLocalStorage = getTokenLocalStorage();
  useEffect(() => {
    if (tokenByLocalStorage && window.location.pathname === '/login') {
      window.location.href = '/home';
    }
  }, [tokenByLocalStorage]);

  window.addEventListener('storage', (event) => {
    if (event.key === 'is_logged_in' && event.newValue) {
      window.location.href = '/';
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      {/* <LanguageSwitcher /> */}
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <AuthProvider>
            <Routes />
          </AuthProvider>
          <StyledToast
            position="top-right"
            theme="colored"
            autoClose={2500}
            newestOnTop={false}
            rtl={false}
            closeOnClick
            pauseOnFocusLoss
            pauseOnHover
          />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
