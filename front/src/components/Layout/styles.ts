import styled from 'styled-components';

export const Container = styled.div`
  background-color: #ffffff;
  width: 100%;
  height: 56px;
  box-shadow: 0px 1px 4px #00000029;
  display: flex;

  .translate {
    height: 100%;
    align-items: center;
    margin-right: 4rem;
    padding-top: 0.5rem;
  }

  .sidebar {
    height: 100vh;
    background-color: #ffffff;
    box-shadow: 0px 4px 8px #00000040;

    display: flex;
    flex-direction: column;
    align-items: center;

    section {
      overflow-y: auto;
      width: 100%;
      height: 100vh;

      display: flex;
      flex-direction: column;

      margin-top: 11px;

      button {
        border: none;
        background-color: transparent;
      }

      .link {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-left: 6px;

        color: #575757;
        font-weight: 600;
        font-size: 14px;
        text-decoration: none;
        transition: all 0.2s ease;

        :last-child {
          width: 100%;
        }

        ::after {
          content: '';
          height: 48px;
          width: 5px;
          border-radius: 5px;
          transition: all 0.2s ease;
        }

        :hover:after {
          background: ${({ theme }) => theme.colors.primary.main};
        }

        &:hover {
          background: ${({ theme }) => theme.colors.primary.light};
          color: ${({ theme }) => theme.colors.primary.main};
        }

        .link-text {
          margin-left: 16px;
          white-space: nowrap;
        }
      }

      .active {
        background: ${({ theme }) => theme.colors.primary.light};
        color: ${({ theme }) => theme.colors.primary.main};

        ::after {
          background: ${({ theme }) => theme.colors.primary.main};
        }
      }
    }
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 120px;

  padding: 22px 26px;

  img {
    width: 99px;
    height: 65px;
  }

  .logo {
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    margin-left: 10px;

    svg  {
      margin: 20px 0px 0px 30px;
    }
  }

  .bars {
    cursor: pointer;
    font-size: 1.5rem;

    img {
      width: 60px;
      height: 71px;
    }

    svg {
      margin: 0px 0px 10px 4px;
      width: 30px;
      height: 30px;
    }
  }

  position: relative;

  small {
    font-weight: bold;
    font-size: 0.75rem;
    position: absolute;
    top: 4.3rem;
    left: 4.2rem;

    animation: 1s ease 0s normal forwards 1 showSmall;
  }

  @keyframes showSmall {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

export const IconBox = styled.div`
  display: flex;
  align-items: center;

  svg {
    margin-left: 30px;
    width: 20px;
    height: 20px;
  }
`;

export const Box = styled.div`
  display: flex;
`;

export const BoxLogout = styled.div`
  display: flex;
  margin-top: auto;
`;

export const Divider = styled.hr`
  width: 75%;
  border: 0.8px solid #d4d4d4;
  border-radius: 100%;
  background-color: #d4d4d4;
`;

export const Footer = styled.div`
  margin-top: auto;
  width: 100%;
  height: 88px;
  background-color: ${({ theme }) => theme.colors.primary.main};

  display: flex;
  flex-direction: column;

  padding: 12px;
`;

export const UserPhoto = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-left: 16px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: bold;
  color: #ffffff;

  background-color: #00a7ea;
`;

export const UserName = styled.div`
  margin-left: 16px;

  .text-name {
    white-space: nowrap;

    display: flex;
    flex-direction: column;

    p {
      color: #ffffff;
      font-weight: 600;
      margin-bottom: 0px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 200px;
    }

    small {
      color: #f2b91e;
      font-size: 14px;
      font-weight: 600;
    }
  }
`;

export const ChildrenContainer = styled.main`
  padding-left: 69px;
  padding-right: 40px;
  overflow-y: auto;

  .chidlren-box {
    width: 100%;
    height: 100%;
  }
`;
