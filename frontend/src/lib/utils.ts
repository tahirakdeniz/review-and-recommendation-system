export const nameFormatter = (name: string): string => {
    return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export const messageFormatter = (message: string): string => {
    return message.charAt(0).toUpperCase() + message.slice(1);
}