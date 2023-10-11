import styled from 'styled-components';
import { ButtonIconProps } from './ButtonIconProps';

export const CustomButton = styled.button<ButtonIconProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 16px;
  width: 230px;
  height: 48px;
  color: #ffffff;
  font-weight: bold;
  background-color: ${({ theme }) => theme.colors.primary.main};
  border: none;
  border-radius: 4px;

  transition: all 0.2s ease;

  svg {
    width: 1.6rem;
    height: 1.6rem;
  }

  &:hover {
    filter: brightness(0.8);
  }

  &:active {
    opacity: 0.7;
  }
`;
