import Api from '../../services/Api';
import { formatDateBack } from '../../utils/formatParams/formatDateBack';
import { IFilter, IFilterMST } from './types';

export async function getProductivityHour(filters: IFilter) {
  const params = new URLSearchParams();

  const date = formatDateBack(filters.current_date);

  if (filters.mst_name) params.append('mst_name', filters.mst_name);
  if (filters.current_date) params.append('created_at', date);

  params.append(
    'start_hour',
    filters.start_hour < 10
      ? `0${filters.start_hour.toString()}`
      : filters.start_hour.toString(),
  );

  params.append(
    'end_hour',
    filters.end_hour < 10
      ? `0${filters.end_hour}`
      : filters.end_hour.toString(),
  );

  return await Api.get('sn-list/productivity-hour', { params });
}

export async function getProductivityMST(filters: IFilterMST) {
  const params = new URLSearchParams();

  const startDate = formatDateBack(filters.start_date);

  const endDate = formatDateBack(filters.end_date);

  if (filters.mst_name) params.append('mst_name', filters.mst_name);
  if (filters.start_date && filters.end_date)
    params.append('start_date', startDate);
  if (filters.start_date && filters.end_date)
    params.append('end_date', endDate);

  return await Api.get('sn-list/productivity-mst', { params });
}
