import styled from 'styled-components';

export const Container = styled.div`
  width: 98%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: fixed;
`;

export const Line = styled.hr`
  width: 98%;
  height: 1%;
  border: 0.8px solid #d4d4d4;
  border-radius: 100%;
  background-color: #d4d4d4;
`;

export const Header = styled.div`
  background-color: #05328d;
  width: 100%;
  height: 42px;
  box-shadow: 0px 0px 3px #00000029;
  border-radius: 4px;
`;

export const Table = styled.div`
  max-width: 1100px;
  height: 82%;
  padding: 16px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  overflow-x: scroll;
`;

export const ContainerColum = styled.div`
  width: 100%;
  max-width: 1540px;
  background-color: #ffffff;
  box-shadow: 0px 0px 3px #00000029;
  display: flex;
  flex-direction: column;
  padding-bottom: 16px;

  .grid {
    display: grid;
    flex-direction: row;
    grid-template-columns: 2.5fr 1fr;
    margin: 16px;
    gap: 1rem;
  }

  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .info {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    height: 65px;
    gap: 1rem;
    max-width: 1100px;
    margin-bottom: 16px;
  }
  .total {
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    background-color: #ec9c00;
    h1 {
      color: #ffffff;
      font-size: 30px;
    }
  }

  .mst {
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    h1 {
      font-size: 30px;
    }
  }

  .length {
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    background: #f4f4f5;
    h1 {
      font-size: 30px;
    }
  }
  .occup {
    display: flex;
    padding: 0 1rem;
  }
`;

export const Occuppation = styled.div`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 1rem;
  gap: 0.5rem;
  width: 100%;

  .line {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
    white-space: nowrap;
  }

  .space {
    width: 100%;
    overflow-x: scroll;
    .box {
      display: flex;
      align-items: row;
      gap: 1rem;
      white-space: nowrap;
      padding-bottom: 8px;
    }
  }

  h1 {
    font-size: 32px;
  }
`;
