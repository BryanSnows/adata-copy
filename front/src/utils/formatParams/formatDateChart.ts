import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import enUS from 'date-fns/locale/en-US';

export function formatDateChart(date: string | Date): string {
  const language = localStorage.getItem('language');
  return format(new Date(date), "dd/MMM", {
    locale: language === 'ptBR' ? ptBR : enUS,
  });
}
