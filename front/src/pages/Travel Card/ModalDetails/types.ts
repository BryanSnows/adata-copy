export interface ISituation {
  isCommentDrawerActive: boolean;
  toggleCommentDrawer: (isDrawerOpen: boolean) => void;
  travelCardSerial?: number;
  cont?: number;
  snlist?: any;
}

export interface IFilter {
  created_at: string | Date;
  situation_id: number;
  test_serial_count: number;
  mst: { mst_name: string } | undefined;
}
