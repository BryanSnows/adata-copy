import styled from 'styled-components';
import { ISituation } from './types';

export const Container = styled.div<ISituation>``;

export const Content = styled.div`
  padding: 20px;
  height: 100vh;
  width: 400px;  

  .close-icon {
    color: #737373;
    font-size: 1.2rem;
    border: 0;
    justify-self: flex-end;
    background-color: transparent;
    align-self: flex-end;

    border-radius: 800%;

    transition: background-color 0.2s ease;

    &:hover {
      background-color: #ccc;
    }
  }
`;

export const Divider = styled.hr`
  width: 100%;
  border: 0.3px solid #EDF1FC;
  border-radius: 100%;
  background-color: #EDF1FC;
`;

export const Close = styled.div`
  display: flex;
width: 100%;
justify-content: end;
`;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem 0 3rem 3rem;

  h3 {
    color: #03328D;
  }
  h1{
    font-size: 34px ;
  }
`;

export const Hour = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0rem 1.5rem 2.5rem;

  h5 {
    color: #03328D;
  }
`;

export const Actions = styled.div`
  padding-top: 4rem;
  display: flex;
  justify-content: space-around;
  margin-top: auto;
  gap: 0.5rem;
`;
