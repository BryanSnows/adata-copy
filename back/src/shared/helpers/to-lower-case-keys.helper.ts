export function toLowerCaseKeysHelper(object) {
    const entries = Object.entries(object);
    return Object.fromEntries(
        entries.map(([key, value]) => {
        return [key.toLowerCase(), value];
        }),
    );
}