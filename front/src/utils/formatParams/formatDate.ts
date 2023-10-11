import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export function formatDate(date: string | Date, notFuso?: any): string {
  if (date) {
    const localDate = new Date(date);
    localDate.setMinutes(
      localDate.getMinutes() + localDate.getTimezoneOffset(),
    );
    return format(notFuso ? new Date(date) : localDate, 'dd/MM/yyyy', {
      locale: ptBR,
    });
  }

  return '';
}
