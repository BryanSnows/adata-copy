export function formatToOnlyLetters(item: string) {
  return item
    .replace(/\s{2,}/g, '')
    .replace(/\d/, '')
    .replace('.', '')
    .replace(',', '')
    .replace('!', '')
    .replace('@', '')
    .replace('#', '')
    .replace('$', '')
    .replace('%', '')
    .replace('¨', '')
    .replace('&', '')
    .replace('*', '')
    .replace('(', '')
    .replace(')', '')
    .replace('-', '')
    .replace('_', '')
    .replace('+', '')
    .replace('=', '')
    .replace('§', '')
    .replace('¹', '')
    .replace('²', '')
    .replace('³', '')
    .replace('£', '')
    .replace('¢', '')
    .replace('¬', '')
    .replace('{', '')
    .replace('}', '')
    .replace('[', '')
    .replace(']', '')
    .replace('ª', '')
    .replace('º', '')
    .replace(';', '')
    .replace(':', '')
    .replace('/', '')
    .replace('?', '')
    .replace('°', '')
    .replace(';', '')
    .replace(':', '')
    .replace('<', '')
    .replace('>', '')
    .replace(/"/, '')
    .replace(/'/, '')
    .replace(/'/, '')
    .replace('|', '')
    .replace(/[\\]/, '');
}
