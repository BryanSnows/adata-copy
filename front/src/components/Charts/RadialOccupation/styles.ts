import styled from 'styled-components';

export const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #e0e1e2;
  border-radius: 6px;
  opacity: 1;
  width: 200px;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  font-size: 14px;
`;

export const Bottom = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  font-size: 14px;
  padding: 5px;
`;

export const Divider = styled.hr`
  width: 100%;
  border: 0.6px solid #d4d4d4;
  border-radius: 100%;
  background-color: #d4d4d4;
`;
