export interface MST {
  mst_id: number;
  mst_name: string;
  mst_status: boolean;
}

export interface IProductivityHour {
  hour_test: number;
  seriais_aproved: number;
  seriais_reproved: number;
}

export interface IFilter {
  mst_name: string;
  current_date: Date | null;
  start_hour: number;
  end_hour: number;
}

export interface IFilterMST {
  mst_name: string;
  start_date: Date | string;
  end_date: Date | string;
}
