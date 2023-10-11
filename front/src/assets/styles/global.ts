import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto',"Source Sans Pro", sans-serif;
    scroll-behavior: smooth;
    font-weight: normal;
    
  }

  body {
    background: ${({ theme }: any) => theme.colors.background};
    width: 100%;
    height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-y: hidden;
  }
  
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    transition: all 0.2s ease-in;
  }

  ::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 10px;
    transition: all 0.2s ease-in;

  }

  button {
    cursor: pointer;
    
    &:disabled {
    cursor: not-allowed;
    background-color: #c6c6c6;
    color: #ffffff;
    border: none;

      &:hover {
        background-color: #c6c6c6;
      }

      &:active {
        background-color: #c6c6c6;
      }
    }
  }

  button, input {
    outline: 0;
  }
  
  h1, h2, h3, h4, h5, h6 {
    color: #575757;
    font-weight: bold;
  }

  p, small, sub {
    color: #575757;
  }

  h1 {
    font-size: 1.375rem;
  }

  h2 {
    font-size: 20px;
  }

  h5 {
    font-size: 14px;
  }

  small {
    color: #575757;
    font-size: 0.65rem;
    font-weight: 400;
  }

  input[type=password]::-ms-clear{
    display: none;
  }

  input[type=password]::-ms-reveal{
    display: none;
  }
`;
