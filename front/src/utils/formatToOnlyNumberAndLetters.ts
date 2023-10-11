export function formatToOnlyNumberAndLetters(
  item: string,
  withdraw?: string[],
) {
  if (!withdraw) {
    withdraw = [];
  }

  return item
    .replace(/\s{2,}/g, '')
    .replace(/[@!#*$%&¨()_=+§\{\}\[\]?<>:;]/g, '')
    .replace(`${withdraw.includes('¹') ? '' : '¹'}`, '')
    .replace(`${withdraw.includes('²') ? '' : '²'}`, '')
    .replace(`${withdraw.includes('³') ? '' : '³'}`, '')
    .replace(`${withdraw.includes(',') ? '' : ','}`, '')
    .replace(`${withdraw.includes('£') ? '' : '£'}`, '')
    .replace(`${withdraw.includes('¢') ? '' : '¢'}`, '')
    .replace(`${withdraw.includes('¬') ? '' : '¬'}`, '')
    .replace(`${withdraw.includes('ª') ? '' : 'ª'}`, '')
    .replace(`${withdraw.includes('º') ? '' : 'º'}`, '')
    .replace(`${withdraw.includes(';') ? '' : ';'}`, '')
    .replace(`${withdraw.includes(':') ? '' : ':'}`, '')
    .replace(`${withdraw.includes('°') ? '' : '°'}`, '')
    .replace(/"/, '')
    .replace(/'/, '')
    .replace(`${withdraw.includes('|') ? '' : '|'}`, '')
    .replaceAll(`${withdraw.includes('~') ? '' : '~'}`, '')
    .replaceAll(`${withdraw.includes('^') ? '' : '^'}`, '')
    .replaceAll(`${withdraw.includes('´') ? '' : '´'}`, '')
    .replaceAll(`${withdraw.includes('`') ? '' : '`'}`, '')
    .replaceAll(`${withdraw.includes('˜') ? '' : '˜'}`, '')
    .replace(/[\\]+/, '');
}
