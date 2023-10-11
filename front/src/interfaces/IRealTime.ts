export interface IRealTime {
  total_ssds: number;
  msts: IMsts[];
  mst_to_finalize: IMsts;
}

export interface IMsts {
  cabinet_name: string;
  capacity_percentage: number;
  customer: string;
  mst_name: string;
  remaining_time: string;
  test_time_percentage: number;
  ssd_quantity: string;
  work_order: string;
}