import { lighten, darken } from 'polished';
import styled, { css } from 'styled-components';

import { ButtonMainProps } from './types';

export const ButtonCreateContainer = styled.button<ButtonMainProps>`
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0px 16px;
  width: ${({ width }) => (width ? width : '123px')};
  height: ${({ height }) => (height ? height : '48px')};
  color: #ffffff;
  font-weight: bold;
  background-color: ${({ theme }) => theme.colors.primary.main};
  border: none;
  border-radius: 4px;
  font-size: medium;

  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => lighten(0.1, theme.colors.primary.main)};
  }

  &:active {
    background-color: ${({ theme }) => darken(0.1, theme.colors.primary.main)};
  }

  ${({ secondaryStyle }) =>
    secondaryStyle &&
    css`
      background-color: transparent;
      color: ${({ theme }) => theme.colors.primary.main};
      border: 1px solid ${({ theme }) => theme.colors.primary.main};

      &:hover {
        background-color: ${({ theme }) =>
          lighten(0.5, theme.colors.primary.main)};
      }

      &:active {
        filter: brightness(0.8);
      }
    `}
`;
