import { IOffice, IProfile, IShift, IUser } from '../../interfaces/IGlobal';
import Api from '../Api';

export const fetchOffice = async () => {
  const { data } = await Api.get('office', { params: { orderBy: 'NAME' } });

  const filter = data?.items.filter(
    (status: IOffice) => status.office_status === true,
  );

  return filter.map((item: IOffice) => ({
    value: item.oficce_name,
    id: item.office_id,
  }));
};

export const fetchProfile = async () => {
  const { data } = await Api.get('user/profile');

  return data?.map((item: IProfile) => ({
    value: item.profile_name,
    id: item.profile_id,
  }));
};

export const fetchShift = async () => {
  let params = new URLSearchParams();
  params.append('orderBy', 'NAME');
  const { data } = await Api.get('shift', { params });

  const filter = data?.items.filter(
    (status: IShift) => status.shift_status === true,
  );

  return filter.map((item: IShift) => ({
    value: item.shift_name,
    id: item.shift_id,
  }));
};

export async function getUser(id: number | undefined) {
  const request = await Api.get(`user/${id}`);

  return request.data as IUser;
}
