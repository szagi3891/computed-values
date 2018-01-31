//@flow

import { Connection } from '../Connection';

export const groupConnectionRefresh = (connections: Array<Connection<mixed>>, onRefresh: () => void): (() => void) => {

    const getValues = (): Array<mixed> => {
        return connections.map(connItem => connItem.getValueBox());
    };

    const initValues = getValues();

    const shouldRefresh = (): bool => {
        const newValues = getValues();

        if (initValues.length !== newValues.length) {
            return true;
        }

        const max = initValues.length;

        for (let i=0; i<max; i++) {
            if (initValues[i] !== newValues[i]) {
                return true;
            }
        }

        return false;
    };

    const refresh = () => {
        if (shouldRefresh()) {
            onRefresh();
        }
    };

    for (const connItem of connections) {
        connItem.onNotify(refresh);
    }

    let isUnsub = false;

    return () => {
        if (isUnsub !== false) {
            return;
        }

        isUnsub = true;

        for (const item of connections) {
            item.disconnect();
        }
    }
};
