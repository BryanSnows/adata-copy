export function setTokenLocalStorage(token: string | null) {
  localStorage.setItem('acc_token', token);
}

export function setTokenFirstLocalStorage(token: string | null) {
  localStorage.setItem('first_acc', token);
}

export function setCountLocalStorage(count: number | null) {
  localStorage.setItem('count', JSON.stringify(count));
}

export function setRefreshTokenLocalStorage(refreshToken: string | null) {
  localStorage.setItem('refresh_token', refreshToken);
}

export function setProfileLocalStorage(profile: string | null) {
  localStorage.setItem('profile', profile);
}

export function setUserNameLocalStorage(name: string | null) {
  localStorage.setItem('userName', name);
}

export function setTransactionsLocalStorage(transactions: any) {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

export function getTokenLocalStorage() {
  const json = localStorage.getItem('acc_token');

  if (!json) {
    return null;
  }

  const token = json;

  return token ?? null;
}

export function getTransactionsLocalStorage() {
  const json = localStorage.getItem('transactions');

  if (!json) {
    return null;
  }

  const transactions = JSON.parse(json);

  return transactions ?? null;
}

export function getCountLocalStorage() {
  const json = localStorage.getItem('count');

  if (!json) {
    return null;
  }

  const transactions = JSON.parse(json);

  return transactions ?? null;
}

export function getUserNameLocalStorage() {
  const json = localStorage.getItem('userName');

  if (!json) {
    return null;
  }

  const transactions = json;

  return transactions ?? null;
}

export function getProfileLocalStorage() {
  const json = localStorage.getItem('profile');

  if (!json) {
    return null;
  }

  const transactions = json;

  return transactions ?? null;
}
