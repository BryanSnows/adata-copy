function padToTwoDigits(number: number) {
  return number.toString().padStart(2, '0');
}

export function minutesToHours(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${padToTwoDigits(hours)}:${padToTwoDigits(minutes)}:00`;
}

