import styled from 'styled-components';

export const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #f5fbfc;
  border-radius: 6px;

  .close-icon {
    display: flex;
    justify-content: flex-end;
    padding: 1rem 1.5rem;

    button {
      color: #737373;
      font-size: 1.2rem;
      border: 0;

      background-color: transparent;

      transition: filter 0.2s ease;

      &:hover {
        filter: brightness(0.5);
      }
    }
  }
`;
