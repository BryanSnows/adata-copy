export function formatToOnlyNumbers(number: string) {
  return number
    .replace(/\D/g, '')
    .replace(/[^0-9.]/g, '')
    .replace('.', '')
    .replace(/(\..*?)\..*/g, '$1');
}
