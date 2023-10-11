import styled from 'styled-components';

interface IContainer {
  size?: string;
}

export const Container = styled.div<IContainer>`
  width: ${({ size }) => (size ? size : '100%')};

  display: flex;
  background-color: #ffffff;
  padding: 0.7rem 0.5rem;
  border-radius: 5px;
  outline: 1px solid #707070;
  transition: all 0.2s ease-in;
  cursor: pointer;

  &:hover {
    outline-width: 2px;
  }

  input {
    flex-grow: 1;
    border: none;
    color: #737373;
    margin-left: 0.5rem;

    &:focus {
      outline: 0;
    }
  }

  button {
    display: flex;
    border: none;
    background-color: transparent;
  }
`;
