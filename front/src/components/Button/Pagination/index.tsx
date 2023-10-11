import { ReactComponent as ChevronLeft } from '../../../assets/icons/chevron-left.svg';
import { ReactComponent as ChevronRight } from '../../../assets/icons/chevron-right.svg';
import { ReactComponent as ChevronDoubleLeft } from '../../../assets/icons/chevron-double-left.svg';
import { ReactComponent as ChevronDoubleRight } from '../../../assets/icons/chevron-double-right.svg';
import { IPaginationProps } from './types';
import {
  CurrentPage,
  NavigatorButton,
  PaginationBox,
  PaginationContainer,
  TotalPages,
} from './styles';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: IPaginationProps) {
  const [actualPage, setActualPage] = useState(currentPage);
  const { t } = useTranslation();

  useEffect(() => {
    setActualPage(currentPage);
  }, [currentPage]);

  function onNext() {
    setActualPage((prev) => {
      if (prev === totalPages) {
        return prev;
      }
      onPageChange(prev + 1);
      return prev + 1;
    });
  }

  function onPrevious() {
    setActualPage((prev) => {
      if (prev === 1) {
        return prev;
      }
      onPageChange(prev - 1);
      return prev - 1;
    });
  }

  return (
    <PaginationBox>
      <PaginationContainer>
        <NavigatorButton
          onClick={() => {
            setActualPage(1);
            onPageChange(1);
          }}
        >
          <ChevronDoubleLeft color="#0000008A" />
        </NavigatorButton>
        <NavigatorButton onClick={onPrevious}>
          <ChevronLeft color="#0000008A" />
        </NavigatorButton>

        <CurrentPage>{actualPage}</CurrentPage>

        <NavigatorButton onClick={onNext}>
          <ChevronRight color="#0000008A" />
        </NavigatorButton>

        <NavigatorButton
          onClick={() => {
            setActualPage(totalPages);
            onPageChange(totalPages);
          }}
        >
          <ChevronDoubleRight color="#0000008A" />
        </NavigatorButton>

        <TotalPages>
          {t('of')} {totalPages}
        </TotalPages>
      </PaginationContainer>
    </PaginationBox>
  );
}
