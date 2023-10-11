import { ICabinet } from '../../interfaces/IGlobal';
import Api from '../Api';

export async function getCabinet(id: number | undefined) {
  const request = await Api.get(`cabinet/${id}`);

  return request.data as ICabinet;
}

export async function getAllCabinet() {
  const { data } = await Api.get('cabinet', {
    params: {
      cabinet_status: '1',
    },
  });

  return data.items.map((item: ICabinet) => ({
    value: item.cabinet_name,
    name: item.cabinet_id,
  }));
}
