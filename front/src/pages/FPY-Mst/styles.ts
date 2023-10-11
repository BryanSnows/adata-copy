import styled from 'styled-components';

export const Header = styled.div`
  background-color: #05328d;
  width: 100%;
  height: 42px;
  box-shadow: 0px 0px 3px #00000029;
  border-radius: 4px;
  margin-bottom:1rem;
`;

export const ContainerCentral = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 1rem;
  margin-top: -1rem;
  width: 100%;
  max-width: 1400px;
`;

export const ContainerT = styled.div`
   width: 100%;
   height: 100%;
  max-width: 1400px;
  max-height: 600px;
  background-color: #ffffff;
  box-shadow: 0px 0px 3px #00000029;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .row { 
    padding: 0rem 1rem 1rem 1rem;
    width: 100%;
    display: grid;
  grid-template-columns: 2.5fr 1fr;
    gap: 1rem;
    height: 100%;
  }
`;


export const ContainerChart = styled.div`
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: center;
padding: 1rem;
`;

export const Dunet = styled.div`
   display: flex;
   height: 100%;
flex-direction: column;
align-items: center;
border: 1px solid #E0E1E2;
padding: 16px;
border-radius: 6px;
text-align: center;
gap:1rem;
      justify-content: center;
opacity: 1;
box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
width: 400px;
h3 {
        font-weight: bold;
        font-size: 22px;
      }

`;
export const Container = styled.div`
  width: 98%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const LineDivider = styled.hr`
  width: 98%;
  border: 0.8px solid #d4d4d4;
  border-radius: 100%;
  background-color: #d4d4d4;
`;
