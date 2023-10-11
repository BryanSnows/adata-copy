import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  width: ${({ newWidth }) => newWidth};

  @media (max-width: 1380px) {
    max-width: ${({ widthMin }) => (widthMin ? widthMin : '')};
  }
`;
