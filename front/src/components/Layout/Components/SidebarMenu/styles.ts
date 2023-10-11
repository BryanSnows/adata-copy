import styled from 'styled-components';

export const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  color: #575757;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s ease;

  .icon-arrow {
    margin-right: 20px;
  }

  cursor: pointer;

  ::after {
    content: '';
    height: 48px;
    width: 5px;
    border-radius: 5px;
    transition: all 0.2s ease;
  }

  :hover:after {
    background: ${({ theme }) => theme.colors.primary.main};
  }

  &:hover {
    background: ${({ theme }) => theme.colors.primary.light};
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

export const IconBox = styled.div`
  display: flex;
  align-items: center;
  svg {
    margin-left: 30px;
    width: 20px;
    height: 20px;
  }
`;

export const Box = styled.div`
  display: flex;
  width: 100%;
  margin-left: 48px;
`;

export const SubMenuContainer = styled.div`
  margin-right: 6px;
`;

export const ToggleItem = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  margin-left: 6px;

  .link-text {
    margin-left: 16px;
    white-space: nowrap;
  }
`;
