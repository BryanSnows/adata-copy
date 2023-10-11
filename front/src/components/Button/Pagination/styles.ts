import styled from 'styled-components';

export const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem;
`;
export const PaginationBox = styled.div`
  display: flex;
  justify-content: end;
  background-color: #ffffff;
  box-shadow: 0px 1px 4px #00000029;
  border-radius: 0px 0px 5px 5px;
`;

export const NavigatorButton = styled.button`
  display: flex;
  background-color: transparent;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.4s ease;
  border: none;

  &:hover {
    background-color: #00939318;
  }
`;

export const CurrentPage = styled.div`
  background-color: ${({ theme }) => theme.colors.primary.main};
  color: #ffffff;
  padding: 0.6rem 1rem;
  border-radius: 5px;
`;

export const TotalPages = styled.div``;
