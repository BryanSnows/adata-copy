import styled from 'styled-components';

export const Box = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  border-radius: 6px;
  opacity: 1;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
`;

export const Header = styled.div`
  height: 70px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  flex-direction: column;
  text-align: center;

  h3 {
    font-weight: bold;
    font-size: 22px;
  }
`;

export const Botton = styled.div`
  padding: 16px;
  margin-top: -1rem;
  display: flex;
  align-items: center;
  justify-content: center;

  flex-direction: column;
  text-align: center;
`;

export const Top = styled.div`
  padding: 16px;
  margin-bottom: -2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  flex-direction: column;
  text-align: center;
`;

export const Divider = styled.hr`
  width: 98%;
  border: 0.8px solid #d4d4d4;
  border-radius: 100%;
  background-color: #d4d4d4;
`;
