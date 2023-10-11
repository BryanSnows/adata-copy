import styled from 'styled-components';

export const ContainerLine = styled.div`
  .progress {
    height: ${({ height }) => (height ? height : '10px')};
    background-color: #e0e1e2;
    position: relative;

    p {
      display: flex;
      justify-content: flex-end;
      padding-top: 14px;
      font-size: 14px;
      color: ${({ theme }) => theme.colors.gray[500]};
    }
  }

  .progress .progress-bar {
    position: absolute;
    height: 100%;
    background-color: #1ea7ea;
    animation: progress-animation 2s linear;
    animation-fill-mode: forwards;
  }

  @keyframes progress-animation {
    0% {
      width: 0%;
    }

    100% {
      width: ${({ percentage }) => (percentage ? percentage : `100%`)};
    }
  }
`;
