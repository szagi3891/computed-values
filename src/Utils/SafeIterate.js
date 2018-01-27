//@flow

export const copyFrom = <T>(iterator: Iterator<T> | Array<T>): Array<T> => {
    const data: Array<T> = [];

    for (const item of iterator) {
        data.push(item);
    }

    return data;
};
