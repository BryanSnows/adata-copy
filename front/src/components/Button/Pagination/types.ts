export interface IPaginationProps {
  totalPages: number;
  currentPage: number;
  pageSize?: number;

  onPageChange: (page: number) => void;
}
