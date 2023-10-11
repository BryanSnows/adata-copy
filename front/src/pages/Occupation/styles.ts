import styled from 'styled-components';

export const Container = styled.div`
  width: 98%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Filters = styled.div`
  display: flex;
  width: 100%;
  max-width: 1400px;
  gap: 2rem;
`;

export const Header = styled.div`
  background-color: #05328d;
  width: 100%;
  height: 2.5rem;
  box-shadow: 0px 0px 3px #00000029;
  border-radius: 4px;
`;

export const Gri = styled.div`
  display: grid;
  height: 100%;
  flex-direction: row;
  gap: 1rem;
`;

export const Box = styled.div`
  display: flex;
  max-width: 1400px;
  flex-direction: column;
  max-height: 250px;
`;

export const Chart = styled.div`
  max-width: 1600px;
  height: 85%;
  margin: 0 16px;
  margin-top: 16px;
  overflow-x: scroll;

  @media (max-width: 1380px) {
    max-width: 1300px;
  }
`;

export const ContainerT = styled.div`
  height: 500px;
  max-width: 1400px;
  background-color: #ffffff;
  box-shadow: 0px 0px 3px #00000029;
  display: flex;
  flex-direction: column;

  @media (max-width: 1380px) {
    height: 400px;
    max-width: 1050px;
  }
`;
