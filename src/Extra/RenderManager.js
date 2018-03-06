//@flow

import { Connection } from '../Connection';

/*
componentWillUnmount() {
    disconnect(this._refresh);
}

_refresh = () => {
    this.forceUpdate();
}

constructor(props) {
    super(props);
    const oldRender = this.render.bind(this);
    this.render = () => catchSubscriptions(this._refresh, () => {
        return oldRender();
    });
}
*/

const isSSR = typeof window === 'undefined';

let catchStack = [];
const subs: Map<() => void, () => void> = new Map();


const groupConnectionRefresh = (connections: Array<Connection<mixed>>, onRefresh: () => void): (() => void) => {

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
        if (subs.has(onRefresh) &&  shouldRefresh()) {
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

export const catchSubscriptionsDisconnect = (refreshFunction: () => void) => {
    const unsub = subs.get(refreshFunction);

    if (unsub) {
        unsub();
    }
};

export const catchSubscriptions = <R>(refreshFunction: () => void, toExec: () => R): R => {
    catchStack.push([]);

    const resultExec = toExec();

    const connections = catchStack.pop();

    const unsub = groupConnectionRefresh(connections, refreshFunction);
    catchSubscriptionsDisconnect(refreshFunction);
    subs.set(refreshFunction, unsub);

    return resultExec;
};

export const catchSubscriptionsPush = (connection: Connection<mixed>) => {
    if (isSSR) {
        connection.disconnect();
    } else {
        if (catchStack.length > 0) {
            catchStack[catchStack.length-1].push(connection);
        } else {
            connection.disconnect();
        }
    }
};
