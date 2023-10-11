import Api from '../../../../services/Api';
import { IMst } from '../types';

export async function getMst(id: number | undefined) {
  const request = await Api.get(`mst/${id}`);

  return request.data as IMst;
}
