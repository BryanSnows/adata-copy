import styled from 'styled-components';

export const Container = styled.div`
  width: 98%;
  height: 85vh;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Wrapper = styled.div`
  display: flex;
  max-width: 955px;
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 0px 1px 4px #00000029;
  border-radius: 5px;
  overflow-y: auto;
  padding: 2rem;
`;

export const ActionsTop = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ActionsExport = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1350px;
  width: 100%;
`;

export const ActionsButton = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  gap: 1rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Box = styled.div`
  display: flex;
  flex-direction: column;
  height: 56vh;
`;
