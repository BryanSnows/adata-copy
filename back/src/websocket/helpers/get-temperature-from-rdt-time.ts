export function getTemperatureFromRdtTime(rdt_time: string): number {
    const temperature = rdt_time.split('(')[1].replace(/[&\/\\#,+()$~%.'":*?<>{}ºC]/g, '');
    return temperature === "ROOM" ? 55 : Number(temperature);
}