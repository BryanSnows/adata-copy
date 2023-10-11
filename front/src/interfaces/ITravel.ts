import { IMst } from '../pages/Register/Mst/types';
import { ICabinet } from './IGlobal';

export interface ITravel {
  travel_card_id: number;
  workorder_serial_id: number;
  position: number;
  mst_id: number;
  cabinet_id: number;
  situation_id: number;
  test_serial_count: number;
  status: Boolean;
  created_at: string;
  workorder_serial: IWO;
  mst: IMst;
  cabinet: ICabinet;
}

export interface IWO {
  workorder_serial_id: number;
  work_order_id: number;
  serial_id: number;
  serial: ISerial;
}

export interface ISerial {
  serial_id: number;
  serial_number: number;
}
