import Api from '../../services/Api';

export const snlistget = async (serial, mst, status, date, start, end) => {
  const request = await Api.get('sn-list', {
    params: {
      page: '1',
      serial_number: serial,
      mst_name: mst,
      status: status,
      created_at: date,
      start_hour: start,
      end_hour: end,
    },
  });

  return request.data;
};
