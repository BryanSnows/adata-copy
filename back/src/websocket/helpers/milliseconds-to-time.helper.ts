export function millisecondsToTime(milliseconds: number) {
    let hours: number | string = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
    let minutes: number | string = Math.floor((milliseconds / (1000 * 60)) % 60);
    let seconds: number | string = Math.floor((milliseconds / 1000) % 60);
  
    hours = hours < 10 ? `0${hours}` : hours.toString();
    minutes = minutes < 10 ? `0${minutes}` : minutes.toString();
    seconds = seconds < 10 ? `0${seconds}` : seconds.toString();
  
    return `${hours}:${minutes}:${seconds}`;
}
