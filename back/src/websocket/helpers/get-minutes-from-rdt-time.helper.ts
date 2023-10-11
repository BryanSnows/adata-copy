export function getMinutesFromRdtTime(rdt_time: string) {
    return Number(rdt_time.split('-')[1].replace(' ', ''));
}