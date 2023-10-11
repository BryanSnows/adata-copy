export function removeDuplicates(array: Array<any>) {
    return array.filter((element: any, index: number) => {
        return array.indexOf(element) === index;
    });
}