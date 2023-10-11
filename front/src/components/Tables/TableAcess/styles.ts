import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  background-color: #ffffff;
  box-shadow: 0px 1px 4px #00000029;
  border-radius: 5px 5px 0px 0px;
`;

export const TableBox = styled.table`
  width: 100%;

  thead th {
    position: sticky;
    top: 0;
    background-color: ${({ theme }) => theme.colors.primary.main};
    z-index: 1;
  }

  thead {
    background-color: ${({ theme }) => theme.colors.primary.main};

    tr th {
      text-align: center;
      font-size: 1rem !important;
      color: #ffffff;
      text-align: left;
      padding: 18px 15px;
      white-space: pre-wrap;
      font-size: 0.8em;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.75pz;

      :first-child {
        border-radius: 4px 0px 0px 4px;
      }

      :last-child {
        border-radius: 0px 4px 4px 0px;
      }
    }
  }

  tbody {
    tr {
      td {
        max-width: 100px;
        overflow-x: hidden;
        white-space: pre-wrap;
        color: #616c84;
        padding: 15px;
        border-bottom: 1px solid #edf1fc;
        text-align: center;
      }
    }
  }

`;

export const Progress = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-content: center;
  margin: 2rem 0px;
`;



