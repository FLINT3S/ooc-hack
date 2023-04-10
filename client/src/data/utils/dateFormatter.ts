export const getDateTime = (d: Date): string => {
    return `${new Date(d).toLocaleDateString()} ${new Date(d).toLocaleTimeString()}`
}