import styled from 'styled-components';

export const ContainerStatus = styled.div`
  margin-top: -1.5rem;
  padding: 0 0 2rem 3rem;
  h4 {
    color: #4a4a4a;
    display: flex;
    p {
      word-break: break-all;
      padding-left: 0.5rem;
    }
  }

  h4 + h4 {
    margin-top: 0.5rem;
  }
`;

export const ContainerMST = styled.div`
  width: 300px;
  background-color: #ffffff;
  margin: 1rem 0 1rem 2rem;
  padding: 1rem 0 1rem 2.5rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  border-radius: 24px;

  strong {
    color: #03328d;
    font-weight: bold;
    font-size: 14px;
  }

  .cabine {
    margin-top: 4px;
  }

  .status {
    margin-top: 8px;
    display: flex;
    align-items: center;
  }

  .details {
    margin-left: 2px;

    small {
      color: #03328d;
      font-weight: bold;
    }
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 0.5rem;
  margin-top: 16px;
  padding-bottom: 16px;
`;
