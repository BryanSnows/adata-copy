import { parseISO } from 'date-fns';
import { zonedTimeToUtc, format } from 'date-fns-tz';
import { addHours } from 'date-fns';

export function formatDateWithTimeZone(date: string): string {
  const parsedDate = parseISO(date);

  const znDate = zonedTimeToUtc(parsedDate, 'America/Manaus');

  const addedDate = addHours(znDate, 4);

  return format(addedDate, 'yyyy-MM-dd');
}
