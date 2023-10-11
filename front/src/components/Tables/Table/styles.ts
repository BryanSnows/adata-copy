import styled from 'styled-components';

export const ContainerWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 56px;
  overflow-y: auto;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background-color: #ffffff;
  box-shadow: 0px 1px 4px #00000029;
  border-radius: 5px 5px 0px 0px;
  overflow-y: auto;
`;

export const TableBox = styled.table`
  width: 100%;
  border-collapse: collapse;
  thead th {
    position: sticky;
    top: 0;
    background-color: ${({ theme }) => theme.colors.primary.main};
    z-index: 1;
  }

  thead {
    background-color: ${({ theme }) => theme.colors.primary.main};

    tr th {
      font-size: 1rem !important;
      color: #ffffff;
      text-align: left;
      padding: 18px 15px;
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
      &.center {
        text-align: center;
      }
    }
  }

  tbody {
    tr {
      td {
        max-width: 100px;
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #616c84;
        padding: 15px;
        border-bottom: 1px solid #edf1fc;

        :last-child {
          max-width: none;
        }
      }
    }
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  button {
    display: flex;
    background-color: transparent;
    border: none;
    color: #616c84;

    &:disabled {
      background: transparent;
    }
  }
`;

export const Empty = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;

  h1 {
    align-self: center !important;
  }

  p {
    color: #4a4a4a;
  }
`;

export const Progress = styled.div`
  display: flex;
  justify-content: center;
  margin: 2rem 0px;
`;
