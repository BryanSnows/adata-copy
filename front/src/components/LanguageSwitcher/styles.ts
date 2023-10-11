import styled, { css } from "styled-components";
import { IToggleBox } from "./types";

export const ToggleContainer = styled.section`
display: flex;
width: 100%;
margin-right: 5rem;
justify-content: flex-end;
gap: 0.6rem;
align-items: center;
`;

export const Toggle = styled.section<IToggleBox>`
  display: flex;
  border-bottom: 1px solid #ccc;
  transition: all 0.2s ease;
  height: 100%;

  button {
    cursor: pointer;
    background: none;
    border: none;

    img {
      padding: 0.1rem;
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
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

