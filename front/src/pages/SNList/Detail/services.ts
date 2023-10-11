import { ISnList } from '../../../interfaces/IGlobal';
import Api from '../../../services/Api';

export async function SnListSerial(serial: number | undefined) {
  const request = await Api.get(`sn-list/${serial}`);

  return request?.data as ISnList[];
}
