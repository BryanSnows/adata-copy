import styled, { css } from "styled-components";
import { IToggleBox } from "./types";

export const ToggleContainer = styled.section`
  display: flex;
 max-width: 15rem;
`;

export const Toggle = styled.div<IToggleBox>`
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #ccc;
  transition: all 0.2s ease;

  button {
    font-size: 16px;
    font-weight: bold;
    color: #4a4a4a;
    border: none;
    background-color: transparent;
    width:6rem;
    height: 3rem;

  }

  &:hover {
    border-width: 3.5px;
    border-color: ${({ theme }) => theme.colors.primary.main};
  }

  ${({ isActive, theme }) =>
    isActive &&
    css`
      border-width: 3.5px;
      border-color: ${theme.colors.primary.main};
    `}
`;
