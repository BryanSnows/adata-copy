import styled from 'styled-components';

export const Container = styled.div`
  .WAMuiChipInput-label-9.WAMuiChipInput-filled-7.WAMuiChipInput-label-9:not(.WAMuiChipInput-labelShrink-10) {
    top: 0.4px;
  }

  .WAMuiChipInput-chipContainer-4 {
    cursor: text;
    display: flex;
    flex-flow: row wrap;
  }

  .MuiFilledInput-root {
    position: relative;
    transition: background-color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
    background-color: rgba(0, 0, 0, 0.09);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  .MuiFormLabel-root.Mui-focused {
    color: ${({ theme }) => theme.colors.primary.main};
  }

  .MuiFilledInput-underline:before {
    left: 0;
    right: 0;
    bottom: 0;
    content: '';
    position: absolute;
    transition: border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    border-bottom: 1px solid rgba(0, 0, 0, 0.42);
    pointer-events: none;
  }

  .MuiFilledInput-underline:after {
    border-bottom: 2px solid ${({ theme }) => theme.colors.primary.main};
  }

  .MuiChip-root{
    background-color: #FFFFFF;
  }

  .WAMuiChipInput-labelShrink-10 {
    color: ${({ theme }) => theme.colors.primary.main};
  }

`;
