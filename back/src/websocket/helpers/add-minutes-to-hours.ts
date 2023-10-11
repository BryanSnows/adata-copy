export function addMinutesToDateHour(currentDateHour: Date, minutes: number) {
    return new Date(new Date(currentDateHour).setMinutes(new Date(currentDateHour).getMinutes() + minutes));
}