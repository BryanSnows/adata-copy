import styled from 'styled-components';

export const Container = styled.div`
  width: 400px;
  height: 360px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  max-width: 300px;
  height: 340px;
  margin: 0 auto;
  text-align: center;

  h1 {
    font-size: 26px;
    margin-bottom: 25px;
  }

  h3 {
    margin-top: 3rem;
    font-size: 1rem;
  }

  button {
    margin-top: auto;
    margin-bottom: 1rem;
    background-color: transparent;
  }
`;

export const FileBoxGroup = styled.section`
  margin-top: 10px;

  a + a {
    margin-top: 18px;
  }
`;

export const LinkField = styled.button`
  display: flex;
  align-items: center;
  width: 256px;
  height: 48px;
  border: 2px solid #707070;
  border-radius: 6px;
  padding: 0 8px;

  text-decoration: none;
  color: inherit;

  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.main};
  }

  svg {
    width: 26px;
    height: 26px;
  }
`;

export const FileInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 0.6rem;

  p {
    width: 1005;
    max-width: 200px;
    font-size: 14px;
    color: #737373;

    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  small {
    align-self: flex-start;
    font-size: 8px;
  }
`;
