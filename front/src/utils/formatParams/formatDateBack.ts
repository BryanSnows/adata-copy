import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export function formatDateBack(date: string | Date): string {
  return format(new Date(date), 'yyyy-MM-dd', {
    locale: ptBR,
  });
}
