export const getDateTime = (d: any): string => {
    return `${new Date(d).toLocaleDateString()} ${new Date(d).toLocaleTimeString()}`
}