export const randomId = (length: number = 6) => {
    let str = '';
    for (let i = 0; i < length; i++)
        str += '0';
    return (Math.random().toString(36) + str).substr(2, length);
}