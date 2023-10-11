export function orderArrayByKey<T>(array: T[], key: string): T[] {
    const collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: 'base'
    });
    
    return array.sort((a, b) => {
        return collator.compare(a[key], b[key]);
    });
}