export type LineProps = {
  seriesData: any[];
  colors?: string;
  categories: any[];
  barWidth?: string;
  title?: string;

  onFilter?: (dataPointIndex: number | null) => void;
};
