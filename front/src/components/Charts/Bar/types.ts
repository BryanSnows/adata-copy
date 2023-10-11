export type BarProps = {
  data: any[];
  seriesName: string;
  categories: any[];
  barWidth?: string;
  title?: string;

  onClickBar?: (dataPointIndex: number | null) => void;
};
