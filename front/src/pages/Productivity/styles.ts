import styled, { css } from 'styled-components';

export const Container = styled.div`
  width: 98%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Filters = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
`;

export const Header = styled.div`
  background-color: #05328d;
  width: 100%;
  height: 2.5rem;
  box-shadow: 0px 0px 3px #00000029;
  border-radius: 4px;

  ${({ onOff }) =>
    onOff &&
    css`
      margin-bottom: 2rem;
    `}
`;

export const Table = styled.div`
  max-width: 1000px;
  height: 87%;
  margin: 0 16px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  text-align: center;
  overflow-x: scroll;
  padding: 10px;

  @media (max-width: 1380px) {
    height: 88%;
    ${({ onOff }) =>
      !onOff &&
      css`
        width: 93%;
        height: 308px;
      `}
  }
`;

export const ContainerColum = styled.div`
  width: 100%;
  max-width: 1350px;
  height: 510px;
  max-height: 855px;
  background-color: #ffffff;
  box-shadow: 0px 0px 3px #00000029;
  display: flex;
  flex-direction: column;
  padding-bottom: 16px;

  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;

    .status {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;

      .icons {
        display: flex;
        flex-direction: row;
        margin-bottom: 8px;
      }
    }

    .total {
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
      font-size: 26px;
      height: 64px;
      width: 250px;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 1rem;
    }
  }

  .check {
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
    height: 144px;
    width: 250px;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 1rem;
    margin-top: 1rem;
    flex-direction: column;
    text-align: center;

    h1 {
      font-size: 55px;
    }

    img {
      padding-top: 1px;
    }

    ${({ onOff }) =>
      !onOff &&
      css`
        flex-direction: row;
        height: 64px;
        width: 280px;
        gap: 8px;

        h1 {
          font-size: 32px;
        }
      `}
  }

  .reject {
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
    height: 144px;
    width: 250px;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 1rem;
    margin-top: 1rem;
    flex-direction: column;

    h1 {
      font-size: 55px;
    }

    img {
      padding-top: 1px;
    }

    ${({ onOff }) =>
      !onOff &&
      css`
        flex-direction: row;
        height: 64px;
        width: 280px;
        gap: 8px;

        h1 {
          font-size: 32px;
        }
      `}
  }

  .bar {
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
    width: 310px;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 1rem;
    margin-top: 1rem;
    flex-direction: column;

    @media (max-width: 1380px) {
      width: 30%;
      height: 389px;
    }

    h1 {
      font-size: 22px;
    }
  }
`;
