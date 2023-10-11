export function percentage(currentValue: number, maxValue: number): number {
    return Number(((100 * currentValue) / maxValue).toFixed(2));
}