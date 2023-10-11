export interface ITableHeader {
  key: string;
  value: string;
  leftHeader?: boolean;
  leftBody?: boolean;
  columnWidth?: string;
  tab?: boolean;
}

export type TableProps = {
  data: any[];
  id?: string;
  loading?: boolean;
  status?: boolean;

  onChangeCheck?: (event: any, item: any) => void;
};
