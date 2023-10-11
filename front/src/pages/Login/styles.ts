import styled from 'styled-components';

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
`;

export const Banner = styled.div`
  height: 100%;
`;

export const Box = styled.div`
  width: 50vw;
  height: 100vh;
`;

export const BoxLanguage = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  padding-right: 6rem;
`;

export const BoxLogin = styled.div`
  width: 50vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
`;

export const Form = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1.5rem;
  width: 52%;
  padding-top: 2rem;
`;

export const B = styled.b`
  color: ${({ theme }) => theme.colors.send.secondary};
  font-weight: bold;
`;
export const Enter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  h5 {
    padding-top: 1rem;
    font-weight: normal;
  }
`;
