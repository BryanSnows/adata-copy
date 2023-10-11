export interface IOccupation {
  quantity_without_cappacity_total: number;
  cabinet_history: IDetailHistory[];
}

export interface IDetailHistory {
  mst_name: string;
  cabinet: string;
  created_at: Date | string;
  quantity: number;
}
