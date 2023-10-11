import styled from 'styled-components';

export const Box = styled.div`
  display: flex;
  width: 328px;
  justify-content: space-between;
  align-items: center;
  background: #ff003d 0% 0% no-repeat padding-box;
  border-radius: 4px;
  opacity: 1;
  padding: 1rem;
  color: #ffffff;
  font-size: 14px;
  gap: 1rem;

  button {
    border: none;
    background: transparent;
    svg {
      height: 20px;
      width: 20px;
    }
  }
  svg {
    height: 24px;
    width: 24px;
    color: #ffffff;
  }
`;

export const Divider = styled.hr`
  width: 75%;
  border: 0.8px solid #ffffff;
  border-radius: 100%;
  align-items: center;
`;

export const BoxIcon = styled.div`
  display: flex;
  gap: 0.5rem;
`;
